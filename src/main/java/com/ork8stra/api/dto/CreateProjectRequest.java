package com.ork8stra.api.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO: Create Project Request
 */


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {
    private String name;
    private String owner;
    private String gitUrl;
    private String branch;
    private String contextPath; // default to .
    private String dockerfilePath; // default to Dockerfile
    private Map<String, String> env; // ENV VARS


}
