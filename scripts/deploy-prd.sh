#!/bin/bash

# Taskflow - Production Cloud Run Deployment Script
# Uses Cloud Build with Artifact Registry
# Version is read from Git tag (no auto-increment)
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

# Get version from environment or Git tag
get_version() {
    # Priority: VERSION env var > Git tag > error
    if [ -n "$VERSION" ]; then
        echo "$VERSION"
    elif command_exists git && [ -d ".git" ]; then
        # Try to get from current Git tag
        local git_tag=$(git describe --tags --exact-match 2>/dev/null || echo "")
        if [ -n "$git_tag" ]; then
            # Remove 'v' prefix if present
            echo "${git_tag#v}"
        else
            print_error "No VERSION specified and not on a Git tag"
            print_info "Please set VERSION in scripts/.env or create a Git tag"
            exit 1
        fi
    else
        print_error "VERSION not set and Git not available"
        print_info "Please set VERSION in scripts/.env"
        exit 1
    fi
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

# Update version in package.json
update_package_version() {
    local new_version=$1
    local package_file="package.json"

    if [ ! -f "$package_file" ]; then
        print_error "package.json not found" >&2
        exit 1
    fi

    # Update version using sed or jq
    if command_exists jq; then
        # Use jq if available (cleaner approach)
        jq ".version = \"$new_version\"" "$package_file" > "${package_file}.tmp" && mv "${package_file}.tmp" "$package_file"
    else
        # Fallback to sed (works on all systems)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/\"version\": *\"[^\"]*\"/\"version\": \"$new_version\"/" "$package_file"
        else
            sed -i "s/\"version\": *\"[^\"]*\"/\"version\": \"$new_version\"/" "$package_file"
        fi
    fi

    print_success "Version set to $new_version in package.json"
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
SERVICE_NAME="${SERVICE_NAME:-APP_NAME-prd}"
SERVICE_PORT="${SERVICE_PORT:-8080}"
SERVICE_MEMORY="${SERVICE_MEMORY:-1Gi}"
SERVICE_CPU="${SERVICE_CPU:-1000m}"
SERVICE_MAX_INSTANCES="${SERVICE_MAX_INSTANCES:-100}"
SERVICE_MIN_INSTANCES="${SERVICE_MIN_INSTANCES:-0}"

# Get version
VERSION=$(get_version)

# Convert version to label-safe format (replace dots with dashes)
LABEL_VERSION=$(echo "$VERSION" | sed 's/\./-/g')

# Main script
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  🚀 APP_NAME - Production Deployment"
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

# Check if service account key path is provided
if [ -z "$SERVICE_ACCOUNT_KEY_PATH" ]; then
    print_error "SERVICE_ACCOUNT_KEY_PATH not set in .env file"
    print_info "Please add SERVICE_ACCOUNT_KEY_PATH=scripts/your-service-account-key.json to your .env file"
    exit 1
fi

# Check if service account key file exists
if [ ! -f "$SERVICE_ACCOUNT_KEY_PATH" ]; then
    print_error "Service account key file not found: $SERVICE_ACCOUNT_KEY_PATH"
    print_info "Please ensure the service account key file exists at the specified path"
    exit 1
fi

# Activate service account
print_info "Activating service account from: $SERVICE_ACCOUNT_KEY_PATH"
if gcloud auth activate-service-account --key-file="$SERVICE_ACCOUNT_KEY_PATH" --quiet 2>&1; then
    # Get the service account email
    SERVICE_ACCOUNT_EMAIL=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -n 1)
    print_success "Service account activated: $SERVICE_ACCOUNT_EMAIL"
else
    print_error "Failed to activate service account"
    print_info "Please check if the service account key file is valid"
    exit 1
fi

echo ""

# Set project
print_info "Setting project to $PROJECT_ID..."
gcloud config set project "$PROJECT_ID" --quiet
print_success "Project configured"

echo ""

# Step 2: Update package.json with version
print_info "Setting application version..."
update_package_version "$VERSION"

echo ""
print_info "Deployment configuration:"
echo "  Project ID: $PROJECT_ID"
echo "  Region: $REGION"
echo "  Service Name: $SERVICE_NAME"
echo "  App Version: $VERSION"
echo "  Label Version: v$LABEL_VERSION"
echo "  Build Method: Cloud Build → Artifact Registry"
echo ""

# Step 3: Install dependencies
print_info "Installing dependencies..."
if npm ci; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 4: Build the application
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

# Step 5: Deploy using Cloud Build (source-based deployment)
print_info "Deploying with Cloud Build..."
print_info "Container image will be stored in Artifact Registry with tag: $VERSION"

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
    --labels "version=v$LABEL_VERSION,deployed-by=deploy-script,method=cloud-build,environment=production" \
    --tag "$VERSION" \
    --allow-unauthenticated \
    --quiet; then

    print_success "Service deployed successfully"
else
    print_error "Service deployment failed"
    print_error "Check the Cloud Build logs for more details"
    exit 1
fi

# Step 6: Get service URL and verify deployment
print_info "Verifying deployment..."

if SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --format='value(status.url)' 2>/dev/null); then
    REVISION_NAME=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --format='value(status.latestReadyRevisionName)' 2>/dev/null)

    echo ""
    echo "═══════════════════════════════════════════════════════"
    print_success "Deployment completed successfully!"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    print_info "Service URL: ${GREEN}$SERVICE_URL${NC}"
    print_info "Active Revision: $REVISION_NAME"
    print_info "Application Version: ${GREEN}v$VERSION${NC}"
    echo ""
    print_info "Container images are stored in Artifact Registry:"
    echo "  https://console.cloud.google.com/artifacts?project=$PROJECT_ID"
    echo "  Tag: $VERSION"
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

# Step 7: Clean up old images from Artifact Registry
cleanup_old_images

print_success "Happy coding! 🎉"
echo ""
