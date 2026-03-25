#!/usr/bin/env bash
#
# SafeTrekr Marketing -- DOKS Cluster Provisioning Script
# Task: ST-790 (REQ-007)
#
# This script provisions the DigitalOcean Kubernetes cluster, configures
# kubectl access, creates namespaces, and installs cluster add-ons.
#
# Prerequisites:
#   - doctl CLI installed and authenticated (doctl auth init)
#   - kubectl installed (v1.31+)
#   - helm installed (v3.14+)
#
# Usage:
#   chmod +x provision.sh
#   ./provision.sh
#
# This script is idempotent for namespace and add-on steps.
# The cluster creation step will fail safely if the cluster already exists.
#
set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CLUSTER_NAME="safetrekr-marketing"
REGION="nyc1"
K8S_VERSION="1.31.1-do.0"
NODE_POOL_NAME="general"
NODE_SIZE="s-2vcpu-4gb"
NODE_COUNT=2
NODE_MIN=2
NODE_MAX=4
TAGS="safetrekr,marketing,production"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---------------------------------------------------------------------------
# Color output helpers
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------
preflight() {
  log_info "Running pre-flight checks..."

  if ! command -v doctl &>/dev/null; then
    log_error "doctl CLI is not installed. Install from https://docs.digitalocean.com/reference/doctl/how-to/install/"
    exit 1
  fi

  if ! command -v kubectl &>/dev/null; then
    log_error "kubectl is not installed. Install from https://kubernetes.io/docs/tasks/tools/"
    exit 1
  fi

  if ! command -v helm &>/dev/null; then
    log_error "helm is not installed. Install from https://helm.sh/docs/intro/install/"
    exit 1
  fi

  # Verify doctl is authenticated
  if ! doctl account get &>/dev/null; then
    log_error "doctl is not authenticated. Run: doctl auth init"
    exit 1
  fi

  log_info "Pre-flight checks passed."
}

# ---------------------------------------------------------------------------
# Step 1: Create the DOKS cluster
# ---------------------------------------------------------------------------
create_cluster() {
  log_info "Checking if cluster '${CLUSTER_NAME}' already exists..."

  if doctl kubernetes cluster get "${CLUSTER_NAME}" &>/dev/null; then
    log_warn "Cluster '${CLUSTER_NAME}' already exists. Skipping creation."
    return 0
  fi

  log_info "Creating DOKS cluster '${CLUSTER_NAME}' in ${REGION}..."
  log_info "  Node pool: ${NODE_POOL_NAME} (${NODE_SIZE}, ${NODE_COUNT} nodes, autoscale ${NODE_MIN}-${NODE_MAX})"
  log_info "  Kubernetes version: ${K8S_VERSION}"
  log_info "  HA control plane: enabled"

  doctl kubernetes cluster create "${CLUSTER_NAME}" \
    --region "${REGION}" \
    --version "${K8S_VERSION}" \
    --node-pool "name=${NODE_POOL_NAME};size=${NODE_SIZE};count=${NODE_COUNT};auto-scale=true;min-nodes=${NODE_MIN};max-nodes=${NODE_MAX}" \
    --ha \
    --tag "${TAGS}" \
    --wait

  log_info "Cluster '${CLUSTER_NAME}' created successfully."
}

# ---------------------------------------------------------------------------
# Step 2: Configure kubectl access
# ---------------------------------------------------------------------------
configure_kubeconfig() {
  log_info "Saving kubeconfig for '${CLUSTER_NAME}'..."

  doctl kubernetes cluster kubeconfig save "${CLUSTER_NAME}"

  log_info "kubeconfig saved. Current context set to '${CLUSTER_NAME}'."
}

# ---------------------------------------------------------------------------
# Step 3: Verify cluster health
# ---------------------------------------------------------------------------
verify_cluster() {
  log_info "Verifying cluster health..."

  echo ""
  log_info "Cluster info:"
  kubectl cluster-info

  echo ""
  log_info "Node status:"
  kubectl get nodes -o wide

  # Verify expected node count
  READY_NODES=$(kubectl get nodes --no-headers | grep -c "Ready" || true)
  if [ "${READY_NODES}" -lt "${NODE_COUNT}" ]; then
    log_warn "Expected ${NODE_COUNT} ready nodes but found ${READY_NODES}. Nodes may still be provisioning."
  else
    log_info "All ${READY_NODES} nodes are Ready."
  fi
}

# ---------------------------------------------------------------------------
# Step 4: Create namespaces (declarative)
# ---------------------------------------------------------------------------
create_namespaces() {
  log_info "Applying namespace definitions..."

  kubectl apply -f "${SCRIPT_DIR}/namespaces.yaml"

  echo ""
  log_info "Namespace status:"
  kubectl get namespaces --show-labels | grep -E "production|staging|preview|monitoring"
}

# ---------------------------------------------------------------------------
# Step 5: Install Nginx Ingress Controller
# ---------------------------------------------------------------------------
install_ingress_nginx() {
  log_info "Installing Nginx Ingress Controller..."

  helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx 2>/dev/null || true
  helm repo update ingress-nginx

  # Check if already installed
  if helm list -n ingress-nginx | grep -q ingress-nginx; then
    log_warn "ingress-nginx already installed. Upgrading..."
  fi

  helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx \
    --create-namespace \
    --set controller.replicaCount=2 \
    --set controller.resources.requests.cpu=100m \
    --set controller.resources.requests.memory=128Mi \
    --set controller.resources.limits.cpu=500m \
    --set controller.resources.limits.memory=256Mi \
    --set controller.config.use-gzip="true" \
    --set controller.config.gzip-types="text/html text/css application/javascript application/json image/svg+xml" \
    --set controller.config.enable-brotli="true" \
    --set controller.config.brotli-types="text/html text/css application/javascript application/json image/svg+xml" \
    --set controller.service.type=LoadBalancer \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-name"="safetrekr-marketing-lb" \
    --set controller.service.annotations."service\.beta\.kubernetes\.io/do-loadbalancer-size-unit"="1" \
    --set controller.metrics.enabled=true \
    --wait

  log_info "Nginx Ingress Controller installed."

  echo ""
  log_info "Waiting for Load Balancer external IP (may take 1-2 minutes)..."
  kubectl get svc -n ingress-nginx ingress-nginx-controller -w --timeout=120s 2>/dev/null || true

  echo ""
  log_info "Load Balancer status:"
  kubectl get svc -n ingress-nginx ingress-nginx-controller
}

# ---------------------------------------------------------------------------
# Step 6: Install cert-manager
# ---------------------------------------------------------------------------
install_cert_manager() {
  log_info "Installing cert-manager..."

  helm repo add jetstack https://charts.jetstack.io 2>/dev/null || true
  helm repo update jetstack

  # Check if already installed
  if helm list -n cert-manager | grep -q cert-manager; then
    log_warn "cert-manager already installed. Upgrading..."
  fi

  helm upgrade --install cert-manager jetstack/cert-manager \
    --namespace cert-manager \
    --create-namespace \
    --set crds.enabled=true \
    --set resources.requests.cpu=50m \
    --set resources.requests.memory=64Mi \
    --set resources.limits.cpu=200m \
    --set resources.limits.memory=128Mi \
    --wait

  log_info "cert-manager installed."

  # Wait for webhook to be ready
  log_info "Waiting for cert-manager webhook..."
  kubectl wait --for=condition=Available deployment/cert-manager-webhook \
    -n cert-manager --timeout=120s

  log_info "cert-manager webhook is ready."
}

# ---------------------------------------------------------------------------
# Step 7: Create Let's Encrypt ClusterIssuers
# ---------------------------------------------------------------------------
create_cluster_issuers() {
  log_info "Creating Let's Encrypt ClusterIssuers..."

  # Production issuer
  kubectl apply -f - <<'EOF'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-production
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: devops@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-production-key
    solvers:
      - http01:
          ingress:
            class: nginx
EOF

  # Staging issuer (for testing; higher rate limits)
  kubectl apply -f - <<'EOF'
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: devops@safetrekr.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
      - http01:
          ingress:
            class: nginx
EOF

  log_info "ClusterIssuers created (production + staging)."
}

# ---------------------------------------------------------------------------
# Step 8: Verify metrics-server
# ---------------------------------------------------------------------------
verify_metrics_server() {
  log_info "Checking metrics-server..."

  if kubectl get deployment metrics-server -n kube-system &>/dev/null; then
    log_info "metrics-server is installed (pre-installed by DOKS)."
  else
    log_warn "metrics-server not found. Installing via Helm..."
    helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/ 2>/dev/null || true
    helm repo update metrics-server
    helm upgrade --install metrics-server metrics-server/metrics-server \
      --namespace kube-system \
      --wait
    log_info "metrics-server installed."
  fi
}

# ---------------------------------------------------------------------------
# Step 9: Final verification
# ---------------------------------------------------------------------------
final_verification() {
  echo ""
  echo "================================================================"
  log_info "FINAL VERIFICATION"
  echo "================================================================"

  echo ""
  log_info "Nodes:"
  kubectl get nodes

  echo ""
  log_info "Namespaces:"
  kubectl get namespaces

  echo ""
  log_info "Pods across all namespaces:"
  kubectl get pods -A

  echo ""
  log_info "Services (ingress):"
  kubectl get svc -n ingress-nginx

  echo ""
  log_info "ClusterIssuers:"
  kubectl get clusterissuer

  echo ""
  log_info "Resource quotas:"
  kubectl get resourcequota -A

  echo ""
  echo "================================================================"
  log_info "Cluster provisioning complete."
  echo "================================================================"
  echo ""
  log_info "Next steps:"
  echo "  1. Note the Load Balancer external IP from the ingress-nginx service above"
  echo "  2. Configure Cloudflare DNS A records to point to the LB IP"
  echo "  3. Set up DigitalOcean Container Registry (REQ-008):"
  echo "     doctl registry create safetrekr --subscription-tier starter"
  echo "     doctl registry kubernetes-manifest | kubectl apply -f -"
  echo "  4. Deploy application manifests (REQ-009)"
  echo "  5. Configure billing alerts at \$100, \$150, \$200 thresholds"
  echo ""
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
main() {
  echo ""
  echo "================================================================"
  echo "  SafeTrekr Marketing -- DOKS Cluster Provisioning"
  echo "  Region: ${REGION} | Nodes: ${NODE_MIN}-${NODE_MAX} x ${NODE_SIZE}"
  echo "  Kubernetes: ${K8S_VERSION} | HA: enabled"
  echo "================================================================"
  echo ""

  preflight
  create_cluster
  configure_kubeconfig
  verify_cluster
  create_namespaces
  install_ingress_nginx
  install_cert_manager
  create_cluster_issuers
  verify_metrics_server
  final_verification
}

main "$@"
