# 🏋️ FitForge — MERN Microservices Fitness Platform

A **learning-focused** microservices application built to practice real-world patterns with MERN stack and Kubernetes.

## Services

| Service | Port | Purpose |
|---------|------|---------|
| auth-service | 5001 | JWT signup/login |
| user-service | 5002 | User profiles |
| workout-service | 5003 | Workout plans |
| nutrition-service | 5004 | Diet entries |
| progress-service | 5005 | Progress logs |
| aggregator-service | 4000 | BFF — React's single API endpoint |
| frontend | 3000 | React SPA |

## Quick Start (Docker Compose — local)

```bash
# 1. Copy env file and set JWT_SECRET
cp .env.example .env

# 2. Build and start everything
docker-compose up --build

# 3. Open the app
open http://localhost:80
```

## Architecture

See [architecture.md](./architecture.md) for:
- High-level diagram
- Kubernetes resource mapping
- Docker → Kubernetes migration steps
- Failure scenarios
- Observability roadmap

## EC2 Deployment

```bash
# 1. On EC2 — install Docker
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER   # log out & back in

# 2. Copy project to EC2
scp -r ./k8s_mern_app ec2-user@<EC2_IP>:~/k8s_mern_app

# 3. Set secrets (never commit this file)
cd ~/k8s_mern_app
cp .env.example .env
nano .env   # set JWT_SECRET to a real random value

# 4. Start everything
docker compose up --build -d
```

**AWS Security Group** — only these inbound rules needed:

| Port | Source | Purpose |
|------|--------|---------|
| 22 | Your IP | SSH |
| 80 | 0.0.0.0/0 | Frontend (users) |

Access the app at `http://<EC2_PUBLIC_IP>`

## Kubernetes Next Steps

```bash
# Push images
docker build -t youruser/fitforge-auth:v1 ./services/auth-service && docker push youruser/fitforge-auth:v1
# repeat for all services

# Bootstrap kubeadm cluster (EC2)
# Then write K8s YAMLs for:
# 1. Namespace
# 2. Secrets + ConfigMaps
# 3. MongoDB StatefulSet + PV/PVC
# 4. Redis Deployment
# 5. All microservice Deployments + ClusterIP Services
# 6. Frontend Deployment + NodePort Service
```

## Learning Experiments

```bash
# Scale a service
kubectl scale deployment workout-service --replicas=3 -n fitforge-dev

# Simulate pod crash
kubectl delete pod <pod-name> -n fitforge-dev

# Watch events
kubectl get events -n fitforge-dev --sort-by='.lastTimestamp'
```
