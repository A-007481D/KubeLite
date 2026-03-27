package com.ork8stra.api.controller.github;

import com.ork8stra.api.dto.github.*;
import com.ork8stra.integration.github.GithubService;
import com.ork8stra.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/github")
@RequiredArgsConstructor
public class GitHubController {

    private final GithubService githubService;
    private final com.ork8stra.auth.security.RbacService rbacService;


    @GetMapping("/auth")
    public ResponseEntity<GithubAuthResponse> initiateAuth() {
        String url = githubService.generateAuthUrl();
        return ResponseEntity.ok(GithubAuthResponse.builder().url(url).build());
    }

    @PostMapping("/connect")
    public ResponseEntity<Void> connect(
            @Valid @RequestBody GithubConnectRequest request) {

        User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }
        githubService.connectAccount(user.getId(), request.getAccess_token(), request.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/connect-code")
    public ResponseEntity<Void> connectByCode(
            @Valid @RequestBody GithubConnectCodeRequest request) {

        User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }
        GithubUserProfile profile = githubService.exchangeCodeForUserInfo(request.getCode());
        githubService.connectAccountWithToken(user.getId(), profile.getAccessToken(), profile.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/connection")
    public ResponseEntity<Map<String, Object>> checkConnection() {
        User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }
        boolean isConnected = githubService.isConnected(user.getId());
        return ResponseEntity.ok(Map.of(
                "connected", isConnected,
                "username", user.getGithubUsername() != null ? user.getGithubUsername() : ""));
    }

    @GetMapping("/repos")
    public ResponseEntity<List<GithubRepoResponse>> getRepositories() {
        User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }
        List<GithubRepoResponse> repos = githubService.getUserRepositories(user.getId());
        return ResponseEntity.ok(repos);
    }

    @GetMapping("/branches")
    public ResponseEntity<List<GithubBranchResponse>> getBranches(
            @RequestParam String owner,
            @RequestParam String repo) {

        User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }
        List<GithubBranchResponse> branches = githubService.getRepositoryBranches(user.getId(), owner, repo);
        return ResponseEntity.ok(branches);
    }
}
