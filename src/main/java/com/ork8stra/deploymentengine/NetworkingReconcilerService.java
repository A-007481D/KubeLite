package com.ork8stra.deploymentengine;

import io.fabric8.kubernetes.api.model.Node;
import io.fabric8.kubernetes.api.model.NodeAddress;
import io.fabric8.kubernetes.client.KubernetesClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NetworkingReconcilerService {

    private final KubernetesClient kubernetesClient;
    private final DeploymentRepository deploymentRepository;
    private final DeploymentService deploymentService;

    @Value("${kubelite.base-domain:}")
    private String configuredBaseDomain;

    @EventListener(ApplicationReadyEvent.class)
    public void reconcileSslipDomain() {
        if (configuredBaseDomain == null || !configuredBaseDomain.contains(".sslip.io")) {
            return;
        }

        String minikubeIp = null;
        try {
            Node node = kubernetesClient.nodes().withName("minikube").get();
            if (node != null && node.getStatus() != null && node.getStatus().getAddresses() != null) {
                for (NodeAddress addr : node.getStatus().getAddresses()) {
                    if ("InternalIP".equals(addr.getType())) {
                        minikubeIp = addr.getAddress();
                        break;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Could not fetch minikube node for IP reconciliation", e);
        }

        if (minikubeIp == null) {
            return;
        }

        String newBaseDomain = minikubeIp + ".sslip.io";
        if (newBaseDomain.equals(configuredBaseDomain)) {
            log.info("Minikube IP unchanged ({}), network reconciliation skipped.", newBaseDomain);
            return;
        }

        log.info("Minikube IP changed to {}, reconciling hostnames to use {}", minikubeIp, newBaseDomain);

        // Notify DeploymentService to use the new base domain for future deployments
        deploymentService.setBaseDomain(newBaseDomain);

        // Update all existing Ingresses in Kubernetes natively
        try {
            var ingresses = kubernetesClient.network().v1().ingresses().inAnyNamespace().withLabel("managed-by", "ork8stra").list().getItems();
            for (var ingress : ingresses) {
                try {
                    if (ingress.getSpec() == null || ingress.getSpec().getRules() == null || ingress.getSpec().getRules().isEmpty()) {
                        continue;
                    }

                    String oldHost = ingress.getSpec().getRules().get(0).getHost();
                    if (oldHost != null && oldHost.contains(".sslip.io")) {
                        String[] parts = oldHost.split("\\.");
                        // oldHost is app.project.192.168.x.x.sslip.io
                        if (parts.length >= 2) {
                            String newHost = parts[0] + "." + parts[1] + "." + newBaseDomain;
                            ingress.getSpec().getRules().get(0).setHost(newHost);
                            if (ingress.getSpec().getTls() != null && !ingress.getSpec().getTls().isEmpty()) {
                                ingress.getSpec().getTls().get(0).setHosts(List.of(newHost));
                            }
                            kubernetesClient.network().v1().ingresses().inNamespace(ingress.getMetadata().getNamespace()).resource(ingress).update();
                            log.info("Updated Ingress '{}' to host '{}'", ingress.getMetadata().getName(), newHost);
                        }
                    }
                } catch (Exception e) {
                    log.error("Failed to update Ingress {}", ingress.getMetadata().getName(), e);
                }
            }
        } catch (Exception e) {
            log.error("Failed to list Ingresses for reconciliation", e);
        }

        // Update stored URLs in the DB so Dashboard links don't 404
        try {
            var deployments = deploymentRepository.findAll();
            for (var deployment : deployments) {
                if (deployment.getIngressUrl() != null && deployment.getIngressUrl().contains(".sslip.io")) {
                    String oldUrl = deployment.getIngressUrl();
                    String oldHost = oldUrl.replace("https://", "").replace("http://", "");
                    String[] parts = oldHost.split("\\.");
                    if (parts.length >= 2) {
                        String newHost = parts[0] + "." + parts[1] + "." + newBaseDomain;
                        deployment.setIngressUrl("https://" + newHost);
                        deploymentRepository.save(deployment);
                        log.info("Updated Deployment {} URL to {}", deployment.getId(), "https://" + newHost);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to update Deployment URLs in database", e);
        }

        log.info("Network reconciliation completed successfully.");
    }
}
