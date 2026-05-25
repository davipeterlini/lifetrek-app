#!/bin/bash

# Taskflow - Development Cloud Run Deployment Script
# Uses Cloud Build with Artifact Registry
# Tags images with branch name instead of version
# Container images are automatically stored in Artifact Registry

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Load environment from root .env
load_deploy_config() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

    print_info "Loading environment variables from root .env..."

    # Use simple environment loader
    source "$script_dir/utils/load-env.sh"

    print_success "Environment loaded successfully"
}

# Get branch name
get_branch_name() {
    # Priority: BRANCH_NAME env var > BRANCH_TAG env var > git branch
    if [ -n "$BRANCH_NAME" ]; then
        echo "$BRANCH_NAME"
    elif [ -n "$BRANCH_TAG" ]; then
        echo "$BRANCH_TAG"
    elif command_exists git && [ -d ".git" ]; then
        git rev-parse --abbrev-ref HEAD
    else
        echo "develop"  # Fallback
    fi
}

# Sanitize branch name for use as tag
sanitize_branch_name() {
    local branch=$1
    # Replace / with -, remove special chars, lowercase
    echo "$branch" | sed 's/\//-/g' | sed 's/[^a-zA-Z0-9._-]/-/g' | tr '[:upper:]' '[:lower:]'
}

# Remove old images from Artifact Registry, keeping the N most recent
cleanup_old_images() {
    local repo="$REGION-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/$SERVICE_NAME"
    local keep=5

    print_info "Cleaning up old images in Artifact Registry (keeping last $keep)..."

    local old_images
    old_images=$(gcloud artifacts docker images list "$repo" \
        --include-tags \
        --sort-by=~CREATE_TIME \
        --format="get(version)" \
        --quiet 2>/dev/null | tail -n +$((keep + 1)))

    if [ -z "$old_images" ]; then
        print_info "No old images to remove"
        return 0
    fi

    local count=0
    while IFS= read -r digest; do
        [ -z "$digest" ] && continue
        if gcloud artifacts docker images delete "$repo@$digest" \
            --delete-tags --quiet 2>/dev/null; then
            count=$((count + 1))
        fi
    done <<< "$old_images"

    print_success "Removed $count old image(s) from Artifact Registry"
}

# Load configuration
load_deploy_config

# Configuration with defaults
# PROJECT_ID is required and must be set via environment variable or .env file
if [ -z "$PROJECT_ID" ]; then
    print_error "PROJECT_ID is not set"
    print_info "Please set PROJECT_ID in scripts/.env or as an environment variable"
    exit 1
fi

REGION="${REGION:-us-west1}"
SERVICE_NAME="${SERVICE_NAME:-APP_NAME-dev}"
SERVICE_PORT="${SERVICE_PORT:-8080}"
SERVICE_MEMORY="${SERVICE_MEMORY:-1Gi}"
SERVICE_CPU="${SERVICE_CPU:-1000m}"
SERVICE_MAX_INSTANCES="${SERVICE_MAX_INSTANCES:-100}"
SERVICE_MIN_INSTANCES="${SERVICE_MIN_INSTANCES:-0}"

# Get and sanitize branch name
BRANCH_NAME=$(get_branch_name)
BRANCH_TAG=$(sanitize_branch_name "$BRANCH_NAME")

# Main script
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  🚀 APP_NAME - Development Deployment"
echo "═══════════════════════════════════════════════════════"
echo ""

# Step 1: Prerequisites check
print_info "Checking prerequisites..."

if ! command_exists npm; then
    print_error "npm is not installed. Please install Node.js and npm first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi
print_success "npm is installed"

if ! command_exists gcloud; then
    print_error "Google Cloud CLI (gcloud) is not installed."
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
print_success "gcloud is installed"

# Authenticate with Service Account
print_info "Authenticating with Service Account..."

# Check if already authenticated via Workload Identity (GitHub Actions, etc.)
if [ -n "$GOOGLE_APPLICATION_CREDENTIALS" ] && [ -f "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    print_info "Using pre-authenticated credentials from GOOGLE_APPLICATION_CREDENTIALS: $GOOGLE_APPLICATION_CREDENTIALS"
    if gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS" --quiet 2>&1; then
        SERVICE_ACCOUNT_EMAIL=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -n 1)
        print_success "Service account activated: $SERVICE_ACCOUNT_EMAIL"
    else
        print_error "Failed to activate service account from GOOGLE_APPLICATION_CREDENTIALS"
        exit 1
    fi
elif [ -n "$SERVICE_ACCOUNT_KEY_PATH" ] && [ -f "$SERVICE_ACCOUNT_KEY_PATH" ]; then
    # Activate using local key file (local development)
    print_info "Activating service account from: $SERVICE_ACCOUNT_KEY_PATH"
    if gcloud auth activate-service-account --key-file="$SERVICE_ACCOUNT_KEY_PATH" --quiet 2>&1; then
        SERVICE_ACCOUNT_EMAIL=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -n 1)
        print_success "Service account activated: $SERVICE_ACCOUNT_EMAIL"
    else
        print_error "Failed to activate service account"
        exit 1
    fi
else
    print_error "No service account credentials found. Set SERVICE_ACCOUNT_KEY_PATH or use Workload Identity."
    print_info "For GitHub Actions, ensure google-github-actions/auth@v2 is used before this script."
    exit 1
fi

echo ""

# Set project
print_info "Setting project to $PROJECT_ID..."
gcloud config set project "$PROJECT_ID" --quiet
print_success "Project configured"

echo ""

print_info "Deployment configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service Name: $SERVICE_NAME"
echo "  Branch: $BRANCH_NAME"
echo "  Branch Tag: $BRANCH_TAG"
echo "  Build Method: Cloud Build → Artifact Registry"
echo ""

# Step 2: Install dependencies
print_info "Installing dependencies..."
if npm ci; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Build the application
print_info "Building application..."
if npm run build; then
    print_success "Application built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Verify dist directory exists
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    print_error "dist/ directory is empty or doesn't exist"
    print_info "Build may have failed. Check npm run build output above."
    exit 1
fi

# Step 4: Deploy using Cloud Build (source-based deployment)
print_info "Deploying with Cloud Build..."
print_info "Container image will be stored in Artifact Registry with tag: $BRANCH_TAG"

# Build environment variables array
ENV_VARS_ARRAY=("NODE_ENV=production")
if [ -n "$GEMINI_API_KEY" ]; then
    ENV_VARS_ARRAY+=("GEMINI_API_KEY=$GEMINI_API_KEY")
fi
if [ -n "$VITE_GOOGLE_CLIENT_ID" ]; then
    ENV_VARS_ARRAY+=("VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID")
fi

# Join array into comma-separated string
ENV_VARS=$(IFS=,; echo "${ENV_VARS_ARRAY[*]}")

print_info "Environment variables: $ENV_VARS"

# Deploy using gcloud run deploy with source (Cloud Build automatic)
print_info "Starting Cloud Build deployment..."
echo ""

# Use --tag to specify branch name as tag in Artifact Registry
if gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --project "$PROJECT_ID" \
    --platform managed \
    --port "$SERVICE_PORT" \
    --memory "$SERVICE_MEMORY" \
    --cpu "$SERVICE_CPU" \
    --max-instances "$SERVICE_MAX_INSTANCES" \
    --min-instances "$SERVICE_MIN_INSTANCES" \
    --set-env-vars "$ENV_VARS" \
    --labels "branch=$BRANCH_TAG,deployed-by=deploy-script,method=cloud-build,environment=development" \
    --tag "$BRANCH_TAG" \
    --quiet; then

    print_success "Service deployed successfully"
else
    print_error "Service deployment failed"
    print_error "Check the Cloud Build logs for more details"
    exit 1
fi

# Step 5: Get service URL and verify deployment
print_info "Verifying deployment..."

if SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --format='value(status.url)' 2>/dev/null); then
    REVISION_NAME=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --format='value(status.latestReadyRevisionName)' 2>/dev/null)

    # Get tagged URL (branch-specific URL)
    TAGGED_URL="https://${BRANCH_TAG}---${SERVICE_NAME}-${PROJECT_ID//_/-}.${REGION}.run.app"

    echo ""
    echo "═══════════════════════════════════════════════════════"
    print_success "Deployment completed successfully!"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    print_info "Service URL: ${GREEN}$SERVICE_URL${NC}"
    print_info "Branch URL (no traffic): ${GREEN}$TAGGED_URL${NC}"
    print_info "Active Revision: $REVISION_NAME"
    print_info "Branch: ${GREEN}$BRANCH_NAME${NC}"
    print_info "Branch Tag: ${GREEN}$BRANCH_TAG${NC}"
    echo ""
    print_info "Application deployed and receiving traffic"
    print_info "Branch URL is also available for testing: $TAGGED_URL"
    echo ""
    print_info "Container images are stored in Artifact Registry:"
    echo "  https://console.cloud.google.com/artifacts?project=$PROJECT_ID"
    echo ""
    print_info "You can manage your service at:"
    echo "  https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/metrics?project=$PROJECT_ID"
    echo ""
    print_info "To view logs:"
    echo "  gcloud run services logs read $SERVICE_NAME --region $REGION --project $PROJECT_ID"
    echo ""
else
    print_warning "Could not retrieve service URL (service may still be deploying)"
    echo ""
    print_info "Check deployment status:"
    echo "  gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID"
    echo ""
fi

# Step 6: Clean up old images from Artifact Registry
cleanup_old_images

print_success "Happy coding! 🎉"
echo ""