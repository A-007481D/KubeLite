package com.ork8stra.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Core domain model
 * Represents a User's application project that will be deployed to kubernetes
 * contains all the configuration required to build and deploy
 */

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    private String id;
    private String name;
    private String owner;
    private ProjectSource source;
    private ProjectStatus projectStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Source of the project ( git repo, jar, or zip upload)
     */

    public static class ProjectSource {
        private SourceType type;
        private String location; // git url or file path
        private String branch;
        private String contextPath; // where the code resides, "backend" or "."
        private String dockerfilePath; // Dockerfile or backend/Dockerfile

    }

    /**
     * Source of the project either a GIT repo, a Dockerfile, a JAR artifact, or a zip upload!
     */

    public enum SourceType {
        GIT_REPO,
        JAR_ARTIFACT,
        ZIP_UPLOAD,
        DOCKERFILE,

    }



    public enum ProjectStatus {
        CREATED,
        STOPPED,
        QUEUED,
        RUNNING,
        FAILED,
        DEPLOYING,
        BUILDING


    }

    /**
     * Resource limiting for User deployments
     */

    @Data
    @AllArgsConstructor
    @Builder
    @NoArgsConstructor
    public static class ResourceRequirements {
        private String memory; // fmt : 512Mi
        private String cpu; // fmt : 500m
    }

}
