package com.ork8stra.teammanagement;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
import java.time.Instant;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
public class Team {

    @Id
    private UUID id;
    private String name;
    private UUID organizationId;
    private Instant createdAt;

    public Team(String name, UUID organizationId) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.organizationId = organizationId;
        this.createdAt = Instant.now();
    }
}
