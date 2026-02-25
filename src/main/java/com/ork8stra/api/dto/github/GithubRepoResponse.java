package com.ork8stra.api.dto.github;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GithubRepoResponse {
    private Long id;
    private String name;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("private")
    private boolean isPrivate;

    @JsonProperty("html_url")
    private String htmlUrl;

    @JsonProperty("default_branch")
    private String defaultBranch;

    @JsonProperty("updated_at")
    private String updatedAt;

    private GithubOwner owner;

    @Data
    public static class GithubOwner {
        private String login;
        @JsonProperty("avatar_url")
        private String avatarUrl;
    }
}
