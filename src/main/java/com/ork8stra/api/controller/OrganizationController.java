package com.ork8stra.api.controller;

import com.ork8stra.api.dto.CreateOrganizationRequest;
import com.ork8stra.api.dto.OrganizationResponse;
import com.ork8stra.organizationmanagement.Organization;
import com.ork8stra.organizationmanagement.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orgs")
@RequiredArgsConstructor
public class OrganizationController {
    private final OrganizationService organizationService;
    private final com.ork8stra.auth.security.RbacService rbacService;

    @PostMapping
    public ResponseEntity<OrganizationResponse> createOrganization(
            @Valid @RequestBody CreateOrganizationRequest request) {

        com.ork8stra.user.User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }

        Organization org = organizationService.createOrganization(request.getName(), user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(org));
    }

    @GetMapping
    public ResponseEntity<List<OrganizationResponse>> getMyOrganizations() {

        com.ork8stra.user.User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }

        List<OrganizationResponse> responses = organizationService.getOrganizationsByOwner(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    @PostMapping("/join/{token}")
    public ResponseEntity<OrganizationResponse> joinOrganization(
            @PathVariable String token) {
        
        com.ork8stra.user.User user = rbacService.getCurrentUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found or unauthenticated");
        }

        Organization org = organizationService.acceptInvitation(token, user.getId());
        return ResponseEntity.ok(toResponse(org));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable UUID id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }

    private OrganizationResponse toResponse(Organization org) {
        return OrganizationResponse.builder()
                .id(org.getId())
                .name(org.getName())
                .slug(org.getSlug())
                .build();
    }
}
