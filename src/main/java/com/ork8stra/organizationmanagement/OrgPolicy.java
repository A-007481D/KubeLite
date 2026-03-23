package com.ork8stra.organizationmanagement;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Granular policy defining a set of permissions.
 * Inspired by AWS IAM Policies.
 */
@Entity
@Table(name = "org_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrgPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String document;
}
