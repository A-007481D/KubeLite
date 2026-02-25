package com.ork8stra.api.dto.github;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GithubConnectRequest {
    @NotBlank(message = "Access token is required")
    private String access_token;

    @NotBlank(message = "Username is required")
    private String username;
}
