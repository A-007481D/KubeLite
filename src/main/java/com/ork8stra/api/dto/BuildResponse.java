package com.ork8stra.api.dto;

import com.ork8stra.buildengine.Build;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildResponse {
    private UUID id;
    private UUID applicationId;
    private String status;
    private String imageTag;
    private String jobName;
    private Instant startTime;
    private Instant endTime;
    private java.util.UUID deploymentId;

    public static BuildResponse from(Build build) {
        return BuildResponse.builder()
                .id(build.getId())
                .applicationId(build.getApplicationId())
                .status(build.getStatus().name())
                .imageTag(build.getImageTag())
                .jobName(build.getJobName())
                .startTime(build.getStartTime())
                .endTime(build.getEndTime())
                .build();
    }

    public static BuildResponse from(Build build, java.util.UUID deploymentId) {
        BuildResponse resp = from(build);
        resp.setDeploymentId(deploymentId);
        return resp;
    }
}
