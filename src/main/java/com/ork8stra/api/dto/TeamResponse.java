package com.ork8stra.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamResponse {
    private String id;
    private String name;
    private String organizationId;
    private String createdAt;
}
