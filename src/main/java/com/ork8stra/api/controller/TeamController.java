package com.ork8stra.api.controller;

import com.ork8stra.api.dto.CreateTeamRequest;
import com.ork8stra.api.dto.TeamResponse;
import com.ork8stra.teammanagement.Team;
import com.ork8stra.teammanagement.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.ork8stra.user.User;
import com.ork8stra.auth.security.RbacService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teams")
public class TeamController {

    private final TeamService teamService;
    private final RbacService rbacService;

    @PreAuthorize("@rbacService.hasOrgRole(#organizationId, 'ADMIN')")
    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(
            @RequestHeader("X-Org-ID") UUID organizationId,
            @Valid @RequestBody CreateTeamRequest request) {
        log.info("Creating team '{}' under organization '{}'", request.getName(), organizationId);
        Team team = teamService.createTeam(request.getName(), organizationId);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(team));
    }

    @GetMapping
    public ResponseEntity<List<TeamResponse>> listTeams(@RequestHeader("X-Org-ID") UUID organizationId) {
        User currentUser = rbacService.getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Team> teams;
        if (currentUser.isAdmin() || rbacService.hasOrgRole(organizationId, "ADMIN")) {
            // Admins see all teams in the org
            teams = teamService.getTeamsByOrganizationId(organizationId);
        } else {
            // Regular members only see teams they are in
            teams = teamService.getTeamsByOrganizationId(organizationId).stream()
                    .filter(t -> rbacService.hasTeamAccess(t.getId()))
                    .toList();
        }

        List<TeamResponse> response = teams.stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("@rbacService.isAdmin()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable UUID id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    private TeamResponse toResponse(Team team) {
        return TeamResponse.builder()
                .id(team.getId().toString())
                .name(team.getName())
                .organizationId(team.getOrganizationId() != null ? team.getOrganizationId().toString() : null)
                .createdAt(team.getCreatedAt() != null ? team.getCreatedAt().toString() : null)
                .build();
    }
}
