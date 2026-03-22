package com.ork8stra.deploymentengine;

import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.metrics.v1beta1.PodMetrics;
import io.fabric8.kubernetes.client.KubernetesClient;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.UUID;
import com.ork8stra.applicationmanagement.Application;

@Slf4j
@Service
@RequiredArgsConstructor
public class MetricsService {

    private final KubernetesClient kubernetesClient;

    @Data
    @Builder
    public static class AppMetrics {
        private String appId;
        private int totalPods;
        private int runningPods;
        private int errorPods;
        private double cpuUsageCores;
        private long memoryUsageBytes;
        private List<PodStats> pods;
    }

    @Data
    @Builder
    public static class PodStats {
        private String name;
        private String status;
        private int restarts;
        private String cpu;
        private String memory;
    }

    public AppMetrics getApplicationMetrics(String namespace, String appName) {
        List<Pod> pods = kubernetesClient.pods().inNamespace(namespace).withLabel("app", appName).list().getItems();

        int running = 0;
        int error = 0;
        List<PodStats> podStatsList = new ArrayList<>();

        for (Pod pod : pods) {
            String status = pod.getStatus().getPhase();
            int restarts = pod.getStatus().getContainerStatuses().stream()
                    .mapToInt(cs -> cs.getRestartCount())
                    .sum();

            if ("Running".equals(status))
                running++;
            else if ("Error".equals(status) || "CrashLoopBackOff".equals(status) || "Failed".equals(status))
                error++;

            podStatsList.add(PodStats.builder()
                    .name(pod.getMetadata().getName())
                    .status(status)
                    .restarts(restarts)
                    .build());
        }

        final double totalCpu;
        final long totalMem;

        try {
            // Metrics API call (requires metrics-server)
            Set<String> appPodNames = pods.stream().map(p -> p.getMetadata().getName()).collect(Collectors.toSet());
            List<PodMetrics> allMetrics = kubernetesClient.top().pods().inNamespace(namespace).metrics().getItems();
            List<PodMetrics> metrics = allMetrics.stream()
                    .filter(pm -> appPodNames.contains(pm.getMetadata().getName()))
                    .collect(Collectors.toList());

            totalCpu = metrics.stream()
                    .flatMap(pm -> pm.getContainers().stream())
                    .mapToDouble(c -> parseCpu(c.getUsage().get("cpu")))
                    .sum();

            totalMem = metrics.stream()
                    .flatMap(pm -> pm.getContainers().stream())
                    .mapToLong(c -> parseMemory(c.getUsage().get("memory")))
                    .sum();

        } catch (Exception e) {
            log.debug("Metrics API not available for app '{}': {}", appName, e.getMessage());
            return AppMetrics.builder()
                    .appId(appName)
                    .totalPods(pods.size())
                    .runningPods(running)
                    .errorPods(error)
                    .cpuUsageCores(0)
                    .memoryUsageBytes(0)
                    .pods(podStatsList)
                    .build();
        }

        return AppMetrics.builder()
                .appId(appName)
                .totalPods(pods.size())
                .runningPods(running)
                .errorPods(error)
                .cpuUsageCores(totalCpu)
                .memoryUsageBytes(totalMem)
                .pods(podStatsList)
                .build();
    }

    @Data
    @Builder
    public static class ProjectMetrics {
        private UUID projectId;
        private int totalApps;
        private int totalPods;
        private int runningPods;
        private int errorPods;
        private double totalCpuUsageCores;
        private long totalMemoryUsageBytes;
        private int healthScore;
        private List<AppSummaryMetrics> appBreakdown;
    }

    @Data
    @Builder
    public static class AppSummaryMetrics {
        private UUID appId;
        private String appName;
        private int pods;
        private double cpu;
        private long memory;
        private String status;
        private int restartCount;
        private String timestamp;
    }

    private int calculateHealthScore(int totalPods, int errorPods, double totalCpuUsage, long totalMemoryUsage) {
        if (totalPods == 0) return 100;
        if (errorPods == totalPods) return 0;
        
        int score = 100;
        double errorPct = (double) errorPods / totalPods;
        score -= (int) (errorPct * 50);
        
        // Saturation estimate
        if (totalCpuUsage > 4.0 || totalMemoryUsage > 4L * 1024 * 1024 * 1024) {
            score -= 20;
        }
        
        return Math.max(0, score);
    }

    public ProjectMetrics getProjectMetrics(UUID projectId, List<Application> apps, String namespace) {
        int totalPods = 0;
        int runningPods = 0;
        int errorPods = 0;
        double totalCpu = 0;
        long totalMem = 0;
        List<AppSummaryMetrics> breakdown = new ArrayList<>();

        for (Application app : apps) {
            AppMetrics appStats = getApplicationMetrics(namespace, toKubernetesName(app.getName()));
            totalPods += appStats.getTotalPods();
            runningPods += appStats.getRunningPods();
            errorPods += appStats.getErrorPods();
            totalCpu += appStats.getCpuUsageCores();
            totalMem += appStats.getMemoryUsageBytes();

            int restarts = appStats.getPods().stream().mapToInt(PodStats::getRestarts).sum();

            breakdown.add(AppSummaryMetrics.builder()
                    .appId(app.getId())
                    .appName(app.getName())
                    .pods(appStats.getTotalPods())
                    .cpu(appStats.getCpuUsageCores())
                    .memory(appStats.getMemoryUsageBytes())
                    .restartCount(restarts)
                    .status(appStats.getTotalPods() > 0
                            ? (appStats.getRunningPods() == appStats.getTotalPods() ? "Healthy" : "Degraded")
                            : "Stopped")
                    .build());
        }

        int healthScore = calculateHealthScore(totalPods, errorPods, totalCpu, totalMem);

        return ProjectMetrics.builder()
                .projectId(projectId)
                .totalApps(apps.size())
                .totalPods(totalPods)
                .runningPods(runningPods)
                .errorPods(errorPods)
                .totalCpuUsageCores(totalCpu)
                .totalMemoryUsageBytes(totalMem)
                .healthScore(healthScore)
                .appBreakdown(breakdown)
                .build();
    }

    private String toKubernetesName(String rawName) {
        String normalized = rawName.toLowerCase().replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return normalized.isBlank() ? "app" : normalized;
    }

    private double parseCpu(io.fabric8.kubernetes.api.model.Quantity q) {
        if (q == null) return 0;
        String amount = q.getAmount();
        String format = q.getFormat();
        try {
            double val = Double.parseDouble(amount);
            if (format != null && format.equals("n")) return val / 1_000_000_000.0;
            if (format != null && format.equals("u")) return val / 1_000_000.0;
            if (format != null && format.equals("m")) return val / 1000.0;
            // Fallback for string-encoded quantities
            if (amount.endsWith("n")) return Double.parseDouble(amount.replace("n", "")) / 1_000_000_000.0;
            if (amount.endsWith("u")) return Double.parseDouble(amount.replace("u", "")) / 1_000_000.0;
            if (amount.endsWith("m")) return Double.parseDouble(amount.replace("m", "")) / 1000.0;
            return val;
        } catch (Exception e) {
            return 0;
        }
    }

    private long parseMemory(io.fabric8.kubernetes.api.model.Quantity q) {
        if (q == null) return 0;
        String amount = q.getAmount();
        String format = q.getFormat();
        try {
            double val = Double.parseDouble(amount);
            long factor = 1;
            String unit = (format != null) ? format : "";
            if (unit.isEmpty()) {
                if (amount.endsWith("Ki")) { factor = 1024; val = Double.parseDouble(amount.replace("Ki", "")); }
                else if (amount.endsWith("Mi")) { factor = 1024 * 1024; val = Double.parseDouble(amount.replace("Mi", "")); }
                else if (amount.endsWith("Gi")) { factor = 1024 * 1024 * 1024; val = Double.parseDouble(amount.replace("Gi", "")); }
            } else {
                if (unit.equals("Ki")) factor = 1024;
                else if (unit.equals("Mi")) factor = 1024 * 1024;
                else if (unit.equals("Gi")) factor = 1024 * 1024 * 1024;
            }
            return (long) (val * factor);
        } catch (Exception e) {
            return 0;
        }
    }
}
