package com.ork8stra.api.controller.github;

import com.ork8stra.api.dto.github.GithubAuthResponse;
import com.ork8stra.api.dto.github.GithubBranchResponse;
import com.ork8stra.api.dto.github.GithubConnectRequest;
import com.ork8stra.api.dto.github.GithubRepoResponse;
import com.ork8stra.integration.github.GithubService;
import com.ork8stra.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/github")
@RequiredArgsConstructor
public class GitHubController {

    private final GithubService githubService;

    @GetMapping("/auth")
    public ResponseEntity<GithubAuthResponse> initiateAuth() {
        String url = githubService.generateAuthUrl();
        return ResponseEntity.ok(GithubAuthResponse.builder().url(url).build());
    }

    @PostMapping("/connect")
    public ResponseEntity<Void> connect(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GithubConnectRequest request) {

        // Note: The frontend sends "access_token" but it's actually the "code"
        // parameter
        // returned by the GitHub OAuth flow that we need to exchange.
        githubService.connectAccount(user.getId(), request.getAccess_token(), request.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/connection")
    public ResponseEntity<Map<String, Object>> checkConnection(@AuthenticationPrincipal User user) {
        boolean isConnected = githubService.isConnected(user.getId());
        return ResponseEntity.ok(Map.of(
                "connected", isConnected,
                "username", user.getGithubUsername() != null ? user.getGithubUsername() : ""));
    }

    @GetMapping("/repos")
    public ResponseEntity<List<GithubRepoResponse>> getRepositories(@AuthenticationPrincipal User user) {
        List<GithubRepoResponse> repos = githubService.getUserRepositories(user.getId());
        return ResponseEntity.ok(repos);
    }

    @GetMapping("/branches")
    public ResponseEntity<List<GithubBranchResponse>> getBranches(
            @AuthenticationPrincipal User user,
            @RequestParam String owner,
            @RequestParam String repo) {

        List<GithubBranchResponse> branches = githubService.getRepositoryBranches(user.getId(), owner, repo);
        return ResponseEntity.ok(branches);
    }
}
