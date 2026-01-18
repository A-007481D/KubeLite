package com.ork8stra.projectmanagement;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    private UUID id;
    private String name;
    private String ownerId;
    private String k8sNamespace;

    public Project(String name, String ownerId) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.ownerId = ownerId;
        this.k8sNamespace = generateNamespace(name);
    }

    private String generateNamespace(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]", "-") + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}
