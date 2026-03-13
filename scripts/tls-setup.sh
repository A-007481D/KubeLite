#!/bin/bash
set -e

echo "🔒 Setting up TLS Infrastructure (Cert-Manager)..."

# Apply cert-manager manifests if not present
if ! kubectl get ns cert-manager >/dev/null 2>&1; then
    echo "📦 Installing cert-manager..."
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.4/cert-manager.yaml
    echo "⏳ Waiting for cert-manager pods to be ready..."
    kubectl wait --for=condition=Ready pods --all -n cert-manager --timeout=300s
fi

# Create a self-signed ClusterIssuer for local development
echo "🛠️ Creating Kubelite Self-Signed ClusterIssuer..."
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: kubelite-selfsigned
spec:
  selfSigned: {}
EOF

echo "✅ TLS Infrastructure ready. Applications will now automatically generate HTTPS certificates."
