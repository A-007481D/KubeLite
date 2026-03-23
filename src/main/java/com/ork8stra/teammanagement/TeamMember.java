package com.ork8stra.teammanagement;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Join table representing a User's membership in a Team.
 */
@Entity
@Table(name = "team_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "team_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "team_id", nullable = false)
    private UUID teamId;

    @Column(nullable = false)
    private String role; // "lead", "member", "viewer"

    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "team_member_policies", joinColumns = @JoinColumn(name = "member_id"))
    @Column(name = "policy_id")
    @Builder.Default
    private java.util.List<UUID> policyIds = new java.util.ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (joinedAt == null) joinedAt = Instant.now();
        if (policyIds == null) policyIds = new java.util.ArrayList<>();
    }
}
