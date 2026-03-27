package com.ork8stra.api.controller;

import com.ork8stra.api.dto.IAMSummaryResponse;
import com.ork8stra.api.dto.UserIdentityResponse;
import com.ork8stra.audit.AuditLogRepository;
import com.ork8stra.organizationmanagement.*;
import com.ork8stra.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/iam")
@RequiredArgsConstructor
public class IAMController {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final OrgPolicyRepository orgPolicyRepository;
    private final OrgInvitationRepository orgInvitationRepository;
    private final OrgMemberRepository orgMemberRepository;
    private final AuditLogRepository auditLogRepository;
    private final com.ork8stra.teammanagement.TeamRepository teamRepository;
    private final com.ork8stra.auth.security.RbacService rbacService;

    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<IAMSummaryResponse> getSummary() {
        com.ork8stra.user.User currentUser = rbacService.getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        if (currentUser.isAdmin()) {
            return ResponseEntity.ok(IAMSummaryResponse.builder()
                    .totalUsers(userRepository.count())
                    .activeOrganizations(organizationRepository.count())
                    .totalPolicies(orgPolicyRepository.count())
                    .pendingInvitations(orgInvitationRepository.countByStatus(OrgInvitation.InvitationStatus.PENDING))
                    .auditLogCount(auditLogRepository.count())
                    .build());
        }

        List<UUID> orgIds = orgMemberRepository.findByUserId(currentUser.getId()).stream()
                .map(OrgMember::getOrganizationId)
                .toList();

        long userCount = orgMemberRepository.findAll().stream()
                .filter(m -> orgIds.contains(m.getOrganizationId()))
                .map(OrgMember::getUserId)
                .distinct()
                .count();

        long auditCount = auditLogRepository.findAll().stream()
                .filter(log -> log.getOrganizationId() != null && orgIds.contains(log.getOrganizationId()))
                .count();

        return ResponseEntity.ok(IAMSummaryResponse.builder()
                .totalUsers(userCount)
                .activeOrganizations(orgIds.size())
                .totalPolicies(orgPolicyRepository.findAll().stream()
                        .filter(p -> p.getOrganizationId() != null && orgIds.contains(p.getOrganizationId()))
                        .count())
                .pendingInvitations(orgInvitationRepository.findAll().stream()
                        .filter(i -> orgIds.contains(i.getOrganizationId()) && i.getStatus() == OrgInvitation.InvitationStatus.PENDING)
                        .count())
                .auditLogCount(auditCount)
                .build());
    }

    @GetMapping("/users")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserIdentityResponse>> listUsers() {
        com.ork8stra.user.User currentUser = rbacService.getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        List<com.ork8stra.user.User> targetUsers;
        if (currentUser.isAdmin()) {
            targetUsers = userRepository.findAll();
        } else {
            List<UUID> orgIds = orgMemberRepository.findByUserId(currentUser.getId()).stream()
                    .map(OrgMember::getOrganizationId)
                    .toList();
            
            java.util.Set<UUID> userIdsInOrgs = orgMemberRepository.findAll().stream()
                    .filter(m -> orgIds.contains(m.getOrganizationId()))
                    .map(OrgMember::getUserId)
                    .collect(java.util.stream.Collectors.toSet());
            
            targetUsers = userRepository.findAllById(userIdsInOrgs);
        }

        List<UserIdentityResponse> responses = targetUsers.stream()
                .map(user -> {
                    List<OrgMember> memberships = orgMemberRepository.findByUserId(user.getId());
                    
                    List<UserIdentityResponse.OrganizationMembership> orgMemberships = memberships.stream()
                            .map(m -> {
                                Organization org = organizationRepository.findById(m.getOrganizationId()).orElse(null);
                                return UserIdentityResponse.OrganizationMembership.builder()
                                        .organizationId(m.getOrganizationId())
                                        .organizationName(org != null ? org.getName() : "Unknown")
                                        .role(m.getRole())
                                        .build();
                            })
                            .toList();

                    return UserIdentityResponse.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .createdAt(user.getCreatedAt())
                            .enabled(user.isEnabled())
                            .memberships(orgMemberships)
                            .build();
                })
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/debug-me")
    public ResponseEntity<?> debugMe(org.springframework.security.core.Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body("Not authenticated");
        return ResponseEntity.ok(java.util.Map.of(
            "username", auth.getName(),
            "authorities", auth.getAuthorities().stream().map(Object::toString).toList(),
            "details", auth.getDetails().toString()
        ));
    }

    @GetMapping("/policies")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrgPolicy>> listPolicies() {
        com.ork8stra.user.User currentUser = rbacService.getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        if (currentUser.isAdmin()) {
            return ResponseEntity.ok(orgPolicyRepository.findAll());
        }

        List<UUID> orgIds = orgMemberRepository.findByUserId(currentUser.getId()).stream()
                .map(OrgMember::getOrganizationId)
                .toList();

        return ResponseEntity.ok(orgPolicyRepository.findAll().stream()
                .filter(p -> p.getOrganizationId() != null && orgIds.contains(p.getOrganizationId()))
                .toList());
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<com.ork8stra.audit.AuditLog>> listAuditLogs() {
        com.ork8stra.user.User currentUser = rbacService.getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        if (currentUser.isAdmin()) {
            return ResponseEntity.ok(auditLogRepository.findAllByOrderByCreatedAtDesc());
        }

        List<UUID> orgIds = orgMemberRepository.findByUserId(currentUser.getId()).stream()
                .map(OrgMember::getOrganizationId)
                .toList();

        return ResponseEntity.ok(auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(log -> log.getOrganizationId() != null && orgIds.contains(log.getOrganizationId()))
                .toList());
    }

    @GetMapping("/teams")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<com.ork8stra.teammanagement.Team>> listTeams() {
        com.ork8stra.user.User currentUser = rbacService.getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        if (currentUser.isAdmin()) {
            return ResponseEntity.ok(teamRepository.findAll());
        }

        List<UUID> orgIds = orgMemberRepository.findByUserId(currentUser.getId()).stream()
                .map(OrgMember::getOrganizationId)
                .toList();

        return ResponseEntity.ok(teamRepository.findAll().stream()
                .filter(t -> orgIds.contains(t.getOrganizationId()))
                .toList());
    }

    @GetMapping("/invitations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrgInvitation>> listInvitations() {
        com.ork8stra.user.User currentUser = rbacService.getCurrentUser();
        if (currentUser == null) return ResponseEntity.status(401).build();

        if (currentUser.isAdmin()) {
            return ResponseEntity.ok(orgInvitationRepository.findAll());
        }

        List<UUID> orgIds = orgMemberRepository.findByUserId(currentUser.getId()).stream()
                .map(OrgMember::getOrganizationId)
                .toList();

        return ResponseEntity.ok(orgInvitationRepository.findAll().stream()
                .filter(i -> orgIds.contains(i.getOrganizationId()))
                .toList());
    }
}
