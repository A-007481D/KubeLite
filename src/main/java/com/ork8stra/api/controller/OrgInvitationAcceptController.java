package com.ork8stra.api.controller;

import com.ork8stra.organizationmanagement.Organization;
import com.ork8stra.organizationmanagement.OrganizationService;
import com.ork8stra.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/invitations")
@RequiredArgsConstructor
public class OrgInvitationAcceptController {

    private final OrganizationService organizationService;
    private final com.ork8stra.auth.security.RbacService rbacService;

    @PostMapping("/accept")
    public ResponseEntity<Organization> acceptInvitation(
            @RequestParam String token) {
        
        User user = rbacService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        Organization org = organizationService.acceptInvitation(token, user.getId());
        return ResponseEntity.ok(org);
    }
}
