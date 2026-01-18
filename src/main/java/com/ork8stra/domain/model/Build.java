package com.ork8stra.domain.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Core domain Entity : Build
 * <p>
 * Represents a single build attempt of a project
 * Tracks the containerization process using Kaniko
 */

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Build {
    private String id;
    private String projectId;
    private BuildStatus buildStatus;
    private String imageTag;
    private String buildPodName;
    private Instant startedAt;
    private Instant completedAt;

    @Builder.Default
    private List<String> logs = new ArrayList<>();

    private String errorMessage;

    public enum BuildStatus {
        QUEUED,
        INITIALIZING,
        BUILDING,
        PUSHING,
        SUCCESS,
        FAILED
    }

    public void appendLog(String logLine) {
        this.logs.add(logLine);
    }

    public boolean isTerminal() {
        return buildStatus == BuildStatus.SUCCESS || buildStatus == BuildStatus.FAILED  ;
    }






}
