# 🏋️ FitForge — MERN + Python Microservices Fitness Platform

A **learning-focused** microservices application built to practice real-world patterns with a multi-stack architecture (Node.js + Python) and Kubernetes.

## Services

| Service | Port | Stack | Purpose |
|---------|------|-------|---------|
| auth-service | 5001 | Node.js | JWT signup / login / verify |
| user-service | 5002 | Node.js | User profiles |
| workout-service | 5003 | Node.js | Workout plans |
| nutrition-service | 5004 | Node.js | Diet / nutrition logs |
| progress-service | 5005 | Node.js + Redis | Progress & weight tracking |
| **ai-agent-service** | **5006** | **Python / FastAPI** | **LangChain chatbot (Gemini)** |
| frontend | 3000 | React + nginx | SPA — proxies all `/api/*` calls |

## Quick Start (Docker Compose — local)

```bash
# 1. Copy env file and fill in secrets
cp .env.example .env
# Edit .env:
#   JWT_SECRET=<long-random-string>
#   GOOGLE_API_KEY=<your-google-ai-studio-key>

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
