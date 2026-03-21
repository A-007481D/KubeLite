package com.ork8stra.api.controller;

import com.ork8stra.applicationmanagement.Application;
import com.ork8stra.applicationmanagement.ApplicationService;
import com.ork8stra.deploymentengine.MetricsService;
import com.ork8stra.projectmanagement.Project;
import com.ork8stra.projectmanagement.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/apps")
@RequiredArgsConstructor
public class MonitoringController {

    private final MetricsService metricsService;
    private final ApplicationService applicationService;
    private final ProjectService projectService;

    @GetMapping("/{id}/metrics")
    public ResponseEntity<MetricsService.AppMetrics> getAppMetrics(@PathVariable UUID id) {
        Application app = applicationService.getApplication(id);
        Project project = projectService.getProjectById(app.getProjectId());
        
        String namespace = project.getK8sNamespace();
        String resourceName = app.getName().toLowerCase().replaceAll("[^a-z0-0]", "-");
        
        MetricsService.AppMetrics stats = metricsService.getApplicationMetrics(namespace, resourceName);
        return ResponseEntity.ok(stats);
    }
}
