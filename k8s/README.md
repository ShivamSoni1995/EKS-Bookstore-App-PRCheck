# Kubernetes Manifests for Bookstore Microservices

This directory contains all the Kubernetes manifests needed to deploy the bookstore application as a microservices architecture.

## 📁 Files Overview

### Core Application
- **`namespace.yaml`** - Creates the `bookstore` namespace for resource isolation
- **`api-deployment.yaml`** - Flask API deployment and ClusterIP service
- **`ui-deployment.yaml`** - React UI deployment and ClusterIP service
- **`ingress.yaml`** - NGINX Ingress configuration with multiple routing patterns

## 🚀 Deployment Instructions

### 1. Deploy All Resources
```bash
# Apply all manifests at once
kubectl apply -f k8s/

# Or deploy individually in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/ui-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### 2. Verify Deployment
```bash
# Check all resources in bookstore namespace
kubectl get all -n bookstore

# Check ingress status
kubectl get ingress -n bookstore

# Check pod logs
kubectl logs -f deployment/bookstore-api -n bookstore
kubectl logs -f deployment/bookstore-ui -n bookstore
```

### 3. Set Up Access
```bash
# Add hosts to /etc/hosts
echo "127.0.0.1 bookstore.local ui.bookstore.local api.bookstore.local backend.bookstore.local" | sudo tee -a /etc/hosts

# Set up port forwarding
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 9080:80 &
```

## 🏗️ Architecture Details

### Services Configuration
- **ClusterIP Services**: Internal communication only
- **Service Discovery**: Kubernetes native DNS resolution
- **Port Configuration**: UI (3000), API (5000)

### Ingress Configuration
- **Primary Domain**: `bookstore.local` with path-based routing
- **Service Subdomains**: Individual service access
- **CORS Support**: Cross-origin request handling
- **Rate Limiting**: 100 requests per minute

### Security Features
- **Network Isolation**: ClusterIP services prevent direct external access
- **Ingress Control**: Single entry point for all external traffic
- **CORS Configuration**: Controlled cross-origin access

## 🔧 Management Commands

### Scaling
```bash
# Scale frontend
kubectl scale deployment bookstore-ui --replicas=3 -n bookstore

# Scale backend  
kubectl scale deployment bookstore-api --replicas=2 -n bookstore
```

### Updates
```bash
# Rolling update for API
kubectl set image deployment/bookstore-api api=bookstore-api:v2 -n bookstore

# Rolling update for UI
kubectl set image deployment/bookstore-ui ui=bookstore-ui:v2 -n bookstore
```

### Monitoring
```bash
# Watch pod status
kubectl get pods -n bookstore -w

# View resource usage
kubectl top pods -n bookstore

# Check service endpoints
kubectl get endpoints -n bookstore
```

## 🧹 Cleanup

### Remove Application
```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete namespace (removes everything)
kubectl delete namespace bookstore
```

### Remove Ingress Controller (if needed)
```bash
kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

## 🔍 Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name> -n bookstore
   kubectl logs <pod-name> -n bookstore
   ```

2. **Ingress not working**
   ```bash
   kubectl describe ingress bookstore-ingress -n bookstore
   kubectl logs -f deployment/ingress-nginx-controller -n ingress-nginx
   ```

3. **Service connectivity**
   ```bash
   kubectl exec -it <pod-name> -n bookstore -- wget -qO- http://bookstore-api-service:5000/api/categories
   ```

### Health Checks
```bash
# Test internal connectivity
kubectl exec -it deployment/bookstore-ui -n bookstore -- wget -qO- http://bookstore-api-service:5000/api/categories

# Test ingress routing
curl -H "Host: bookstore.local" http://localhost:9080/api/categories
```

This Kubernetes setup demonstrates a production-ready microservices architecture with proper service isolation, ingress routing, and scalability features.
