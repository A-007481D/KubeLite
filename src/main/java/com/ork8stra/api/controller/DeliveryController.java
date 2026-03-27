package com.ork8stra.api.controller;

import com.ork8stra.applicationmanagement.Application;
import com.ork8stra.applicationmanagement.ApplicationRepository;
import com.ork8stra.buildengine.Build;
import com.ork8stra.buildengine.BuildRepository;
import com.ork8stra.projectmanagement.Project;
import com.ork8stra.projectmanagement.ProjectRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final BuildRepository buildRepository;
    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final com.ork8stra.deploymentengine.DeploymentRepository deploymentRepository;
    private final com.ork8stra.auth.security.RbacService rbacService;

    @GetMapping("/builds")
    @PreAuthorize("isAuthenticated()")
    public List<BuildInfo> getBuilds() {
        List<UUID> accessibleProjectIds = rbacService.getUserAccessibleProjectIds();
        Set<UUID> accessibleAppIds = applicationRepository.findAll().stream()
                .filter(a -> accessibleProjectIds.contains(a.getProjectId()))
                .map(com.ork8stra.applicationmanagement.Application::getId)
                .collect(Collectors.toSet());

        return buildRepository.findAll().stream()
                .filter(b -> accessibleAppIds.contains(b.getApplicationId()))
                .map(this::toInfo)
                .sorted(Comparator.comparing(BuildInfo::getStartTime, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    private BuildInfo toInfo(Build b) {
        Application app = applicationRepository.findById(b.getApplicationId()).orElse(null);
        String appName = app != null ? app.getName() : "Deleted App";
        String projectName = "Unknown";
        if (app != null) {
            projectName = projectRepository.findById(app.getProjectId())
                    .map(Project::getName)
                    .orElse("Deleted Project");
        }

        UUID deploymentId = deploymentRepository.findByApplicationId(b.getApplicationId())
                .stream()
                .filter(d -> Objects.equals(d.getVersion(), b.getImageTag()))
                .map(com.ork8stra.deploymentengine.Deployment::getId)
                .findFirst()
                .orElse(null);

        return new BuildInfo(
                b.getId(),
                b.getApplicationId(),
                deploymentId,
                appName,
                projectName,
                b.getStatus().name(),
                b.getStartTime(),
                b.getEndTime(),
                b.getImageTag(),
                b.getJobName()
        );
    }

    @Data
    @AllArgsConstructor
    public static class BuildInfo {
        private UUID id;
        private UUID applicationId;
        private UUID deploymentId;
        private String applicationName;
        private String projectName;
        private String status;
        private Instant startTime;
        private Instant endTime;
        private String imageTag;
        private String jobName;
    }
}
