# Mock Service

A simple Node.js mock service with REST endpoints, containerized with Docker and deployable with Kubernetes and Helm.

## Features

- Health check endpoints (`/health`, `/ready`)
- Mock REST API endpoints:
  - `GET /api/users` - Get all users
  - `GET /api/products` - Get all products
- Containerized with Docker
- Kubernetes-ready with Helm chart
- Health and readiness probes configured
- Security best practices (non-root user)

## Local Development

### Prerequisites

- Node.js 18 or higher
- Docker
- Kubernetes cluster (minikube, kind, or cloud provider)
- Helm 3.x

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the service:
   ```bash
   npm start
   ```

3. The service will be available at `http://localhost:3000`

## Docker

### Build the Docker Image

```bash
docker build -t mock-service:1.0.0 .
```

### Run the Docker Container

```bash
docker run -p 3000:3000 mock-service:1.0.0
```

## Kubernetes Deployment with Helm

### Prerequisites

- A running Kubernetes cluster
- Helm 3.x installed
- kubectl configured to access your cluster

### Deploy with Helm

1. **Build and Push Docker Image** (if using a remote registry):
   ```bash
   # Build the image
   docker build -t mock-service:1.0.0 .
   
   # Tag for your registry (replace with your registry)
   docker tag mock-service:1.0.0 your-registry/mock-service:1.0.0
   
   # Push to registry
   docker push your-registry/mock-service:1.0.0
   ```

2. **Update values.yaml** (if using a remote registry):
   ```yaml
   image:
     repository: your-registry/mock-service
     tag: "1.0.0"
   ```

3. **Install the Helm Chart**:
   ```bash
   # Install with default values
   helm install mock-service .
   
   # Or install for specific environment
   helm install mock-service . -f values-dev.yaml      # Development
   helm install mock-service . -f values-staging.yaml  # Staging
   helm install mock-service . -f values-prod.yaml     # Production
   ```

4. **Check the deployment**:
   ```bash
   # Check pods
   kubectl get pods
   
   # Check services
   kubectl get services
   
   # Check deployment
   kubectl get deployments
   ```

5. **Access the service**:
   ```bash
   # Port forward to access locally
   kubectl port-forward service/mock-service 3000:3000
   
   # Then access http://localhost:3000
   ```

### Helm Commands

```bash
# Install/upgrade for different environments
helm upgrade --install mock-service . -f values-dev.yaml      # Development
helm upgrade --install mock-service . -f values-staging.yaml  # Staging
helm upgrade --install mock-service . -f values-prod.yaml     # Production

# Uninstall
helm uninstall mock-service

# Check status
helm status mock-service

# Get values
helm get values mock-service

# Test the installation
helm test mock-service

# Run smoke tests on deployed service
./scripts/k8s-test.sh
```

## Testing & Validation

### Helper Scripts

The `scripts/` directory contains automated testing tools:

- **`smoke-test.js`** - Node.js smoke tests

## Configuration

### Environment Variables

- `PORT` - Port to run the service on (default: 3000)

### Helm Values

Key configuration options in `values.yaml`:

```yaml
# Image configuration
image:
  registry: ""  # Optional: Container registry URL
  repository: mock-service
  pullPolicy: IfNotPresent

# Service configuration
service:
  type: ClusterIP
  port: 3000
  targetPort: 3000

# Resource limits
resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
    cpu: 50m
    memory: 64Mi

# Autoscaling
autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 10
```