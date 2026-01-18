package com.ork8stra.deploymentengine;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "deployments")
@Getter
@Setter
@NoArgsConstructor
public class Deployment {

    @Id
    private UUID id;
    private UUID applicationId;
    private String version; // Image Tag
    private int replicas;

    @Enumerated(EnumType.STRING)
    private DeploymentStatus status;

    private String ingressUrl;
    private Instant deployedAt;

    public Deployment(UUID applicationId, String version) {
        this.id = UUID.randomUUID();
        this.applicationId = applicationId;
        this.version = version;
        this.replicas = 1; // Default
        this.status = DeploymentStatus.IN_PROGRESS;
        this.deployedAt = Instant.now();
    }
}
