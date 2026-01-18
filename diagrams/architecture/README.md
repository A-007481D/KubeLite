# Ork8stra V2 - Architecture Diagrams

This folder contains all architecture documentation for the Ork8stra V2 PaaS platform.

## 📁 Structure

```
diagrams/
├── architecture/           # High-level system architecture
│   ├── README.md          # This file
│   ├── v2-architecture.png # Visual component diagram
│   └── component-diagram.md # Mermaid component diagram
├── entity/                 # Domain model diagrams
│   └── class-diagram.mmd   # Entity relationships
├── flow/                   # Sequence & flow diagrams
│   └── deployment-flow.mmd # Full deployment sequence
└── ERD/                    # Database diagrams
    └── database-schema.mmd # PostgreSQL schema
```

## 🏗️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Spring Boot 3 (Java 21) |
| Message Broker | RabbitMQ |
| Build Tool | Kaniko |
| Live Logs | Redis Pub/Sub |
| Log Archive | MinIO |
| Database | PostgreSQL |
| K8s Client | Fabric8 |
| Frontend | React |

## 🔗 Quick Links

- [Component Diagram](./component-diagram.md)
- [Class Diagram](../entity/class-diagram.mmd)
- [Deployment Flow](../flow/deployment-flow.mmd)
- [Database Schema](../ERD/database-schema.mmd)
