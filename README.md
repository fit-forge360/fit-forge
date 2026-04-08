# 🏋️ FitForge — MERN + AI Microservices Fitness Platform

A production-ready microservices application built to practice advanced Kubernetes patterns, multi-stack architecture (Node.js + Python), and full-stack observability. 

## 🏗️ Architecture Overview

FitForge is deployed on a **kubeadm Kubernetes cluster** (AWS EC2, 3 worker nodes) with a dedicated **HAProxy load balancer EC2 instance** sitting in front.

### Microservices
| Service | Tech Stack | Port | Purpose |
|---------|------------|------|---------|
| `auth-service` | Node.js / Express | 5001 | JWT authentication & verification (`auth_db`) |
| `user-service` | Node.js / Express | 5002 | User profile management (`user_db`) |
| `workout-service`| Node.js / Express | 5003 | Workout plans (`workout_db`) |
| `nutrition-service`| Node.js / Express | 5004 | Diet and meal logs (`nutrition_db`) |
| `progress-service` | Node.js / Express | 5005 | Progress tracking (`progress_db` + Redis cache) |
| `ai-agent-service` | Python / FastAPI | 5006 | **LangChain** personalized coaching via Google Gemini |
| `frontend` | React + Vite | 80 | **Pure Static SPA** (nginx serving HTML/JS/CSS) |

### Infrastructure Components
- **Ingress**: Kubernetes Gateway API via **Envoy Gateway**. HTTPRoutes handle path-prefix routing (`/api/auth/*` → `auth-service`, etc.).
- **External Load Balancer**: **HAProxy** on a separate EC2 instance, round-robining internet traffic to K8s worker Envoy NodePorts.
- **Data Stores**:
  - **MongoDB ReplicaSet** (3 Nodes) deployed via the Bitnami Helm chart. 5 discrete databases for the 5 backend services. Storage backed by an NFS PersistentVolume (`5Gi` per node).
  - **Redis** (`7.2-alpine`) via Helm, with Horizontal Pod Autoscaling (HPA) enabled for the `progress-service` cache.
- **Security**: **Sealed Secrets** (kubeseal) encrypts sensitive MongoDB credentials and API keys at rest.
- **Observability**: **kube-prometheus-stack**. Includes Prometheus, Grafana, Node Exporter (hardware metrics), and kube-state-metrics (K8s object states). MongoDB metrics are exposed via a sidecar and auto-discovered.

---

## 🚀 Quick Start (Local Docker Compose)

For local development without Kubernetes, a Compose file is provided.

```bash
# 1. Setup Environment
cp .env.example .env
# Edit .env and supply:
# JWT_SECRET=<random_secret_string>
# GOOGLE_API_KEY=<your_gemini_api_key>

# 2. Build and run
docker compose up --build -d

# 3. Access the app
# Open http://localhost:80 in your browser
```
*Note: In Compose mode, the frontend container acts as a static file server, and the browser makes API requests directly to the service ports via the Docker bridge network.*

---

## ☸️ Kubernetes Deployment Guide

All Kubernetes manifests and Helm charts are located in the `k8s/` directory.

### 1. Pre-requisites
- A running Kubernetes cluster (e.g., kubeadm on EC2).
- `kubectl` and `helm` installed on your master node.
- A configured NFS StorageClass (`mongo-nfs-storage`) for MongoDB.
- Envoy Gateway controller installed in the cluster.
- Built and pushed Docker images for all services.

### 2. Core Setup
```bash
# Create the primary namespace
kubectl apply -f k8s/namespace.yaml

# Install the Bitnami Sealed Secrets controller
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install sealed-secrets bitnami/sealed-secrets -n kube-system

# Apply your sealed secrets (contains MongoDB passwords and API keys)
kubectl apply -f k8s/charts/mongo/mongodb-sealed-secret.yaml
```

### 3. Deploy Data Stores (Helm)
```bash
# Deploy MongoDB ReplicaSet
helm install fitforge-mongo bitnami/mongodb -f k8s/charts/mongo/mongodb-values.yaml -n fit-forge

# Deploy Redis
helm install fitforge-redis ./k8s/charts/redis -n fit-forge
```

### 4. Deploy Microservices
Each service has its own custom Helm chart in `k8s/charts/`.
```bash
helm install auth-service ./k8s/charts/auth-service -n fit-forge
helm install user-service ./k8s/charts/user-service -n fit-forge
helm install workout-service ./k8s/charts/workout-service -n fit-forge
helm install nutrition-service ./k8s/charts/nutrition-service -n fit-forge
helm install progress-service ./k8s/charts/progress-service -n fit-forge
helm install ai-agent-service ./k8s/charts/ai-agent-service -n fit-forge
helm install frontend ./k8s/charts/frontend -n fit-forge
```

### 5. Configure Routing (Envoy Gateway)
```bash
kubectl apply -f k8s/routing/gateway.yaml
kubectl apply -f k8s/routing/http-routes.yaml

# Find the NodePort assigned to the Envoy Gateway to configure your external HAProxy
kubectl get svc -n envoy-gateway-system
```

### 6. Observability Stack (Prometheus / Grafana)
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
kubectl create namespace monitoring

helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  -f k8s/observability/prometheus-values.yaml \
  -n monitoring
```


#