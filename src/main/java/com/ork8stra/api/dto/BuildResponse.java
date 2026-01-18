package com.ork8stra.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BuildResponse {
    private String id;
    private String projectId;
    private String status;
    private String imageTag;
    private List<String> logs;
    private Instant startedAt;
    private Instant completedAt;
}
