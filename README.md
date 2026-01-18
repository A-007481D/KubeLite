# Ork8stra

An enterprise-grade Platform-as-a-Service (PaaS) designed to simplify container-based application deployment. Ork8stra provides an intuitive way to deploy and manage containerized applications with full CI/CD automation.

## 🏗️ Architecture

Ork8stra follows a **Modular Monolith** architecture using Spring Modulith:

```
com.ork8stra/
├── auth/           # JWT Authentication & RBAC
├── organization/   # Multi-tenancy (Organizations)
├── user/           # User management
├── project/        # Project grouping
├── application/    # Deployable applications
├── build/          # Kaniko-based image building
├── deployment/     # K8s deployments
├── messaging/      # RabbitMQ integration
└── logging/        # Redis + MinIO log streaming
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Backend** | Spring Boot 3.5, Java 21 |
| **Architecture** | Modular Monolith (Spring Modulith) |
| **Database** | PostgreSQL |
| **Message Broker** | RabbitMQ |
| **Build Tool** | Kaniko |
| **Log Streaming** | Redis |
| **Log Archive** | MinIO |
| **K8s Client** | Fabric8 |
| **Auth** | JWT + RBAC |

## 📋 Prerequisites

- **Java 21** or higher
- **Docker** and **Docker Compose**
- **Maven** 3.9+
- **Kubernetes** (k3d, minikube, or Docker Desktop)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ork8stra
   ```

2. **Start infrastructure**
   ```bash
   docker-compose up -d
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access the API**
   ```
   http://localhost:8080
   ```

## 🧪 Running Tests

```bash
./mvnw test
```

## 📄 License

This project is a school final project with production aspirations.

---

*Ork8stra - Orchestrating your deployments with precision.*
