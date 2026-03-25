#!/usr/bin/env bash
#
# SafeTrekr Marketing -- DOCR Garbage Collection Script
# Task: ST-791 (REQ-008)
#
# This script removes old image tags from the DigitalOcean Container Registry
# and triggers garbage collection to reclaim storage from unreferenced layers.
#
# Retention policy:
#   - Keep the 10 most recent tags per repository
#   - Delete all tags older than the 10 most recent
#   - Trigger garbage collection after tag deletion
#
# Prerequisites:
#   - doctl CLI installed and authenticated (doctl auth init)
#
# Usage:
#   chmod +x cleanup.sh
#   ./cleanup.sh
#
# Designed to run manually or via GitHub Actions weekly cron (Sunday 4 AM UTC).
#
set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
REGISTRY_NAME="safetrekr-marketing"
REPOSITORY="safetrekr-web"
TAGS_TO_KEEP=10

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

  if ! doctl account get &>/dev/null; then
    log_error "doctl is not authenticated. Run: doctl auth init"
    exit 1
  fi

  # Verify registry exists
  if ! doctl registry get &>/dev/null; then
    log_error "Registry '${REGISTRY_NAME}' not found. Create it first:"
    log_error "  doctl registry create ${REGISTRY_NAME} --subscription-tier starter"
    exit 1
  fi

  log_info "Pre-flight checks passed."
}

# ---------------------------------------------------------------------------
# Step 1: List and prune old tags
# ---------------------------------------------------------------------------
prune_tags() {
  log_info "Fetching tags for repository '${REPOSITORY}'..."

  # Get all tags sorted by updated_at (most recent first).
  # doctl outputs tags in a table; we parse the tag column.
  # The list-tags command returns tags in reverse chronological order by default.
  ALL_TAGS=$(doctl registry repository list-tags "${REPOSITORY}" \
    --format Tag \
    --no-header 2>/dev/null || true)

  if [ -z "${ALL_TAGS}" ]; then
    log_warn "No tags found in repository '${REPOSITORY}'. Nothing to clean up."
    return 0
  fi

  TAG_COUNT=$(echo "${ALL_TAGS}" | wc -l | tr -d ' ')
  log_info "Found ${TAG_COUNT} tags in '${REPOSITORY}'."

  if [ "${TAG_COUNT}" -le "${TAGS_TO_KEEP}" ]; then
    log_info "Tag count (${TAG_COUNT}) is within retention limit (${TAGS_TO_KEEP}). No tags to delete."
    return 0
  fi

  # Tags to delete: everything after the first TAGS_TO_KEEP lines
  TAGS_TO_DELETE=$(echo "${ALL_TAGS}" | tail -n +"$((TAGS_TO_KEEP + 1))")
  DELETE_COUNT=$(echo "${TAGS_TO_DELETE}" | wc -l | tr -d ' ')

  log_info "Deleting ${DELETE_COUNT} tags (keeping ${TAGS_TO_KEEP} most recent)..."

  DELETED=0
  FAILED=0

  while IFS= read -r tag; do
    # Skip empty lines
    [ -z "${tag}" ] && continue

    if doctl registry repository delete-tag "${REPOSITORY}" "${tag}" --force 2>/dev/null; then
      log_info "  Deleted: ${tag}"
      DELETED=$((DELETED + 1))
    else
      log_warn "  Failed to delete: ${tag}"
      FAILED=$((FAILED + 1))
    fi
  done <<< "${TAGS_TO_DELETE}"

  log_info "Tag cleanup complete: ${DELETED} deleted, ${FAILED} failed."
}

# ---------------------------------------------------------------------------
# Step 2: Trigger garbage collection
# ---------------------------------------------------------------------------
run_garbage_collection() {
  log_info "Starting garbage collection for registry '${REGISTRY_NAME}'..."

  # Check if a garbage collection is already running
  if doctl registry garbage-collection get-active "${REGISTRY_NAME}" &>/dev/null; then
    log_warn "A garbage collection is already in progress. Skipping."
    return 0
  fi

  doctl registry garbage-collection start "${REGISTRY_NAME}" --force

  log_info "Garbage collection started."
  log_info "Check status with: doctl registry garbage-collection get-active ${REGISTRY_NAME}"
}

# ---------------------------------------------------------------------------
# Step 3: Report storage usage
# ---------------------------------------------------------------------------
report_storage() {
  log_info "Registry storage report:"

  echo ""
  doctl registry get --format Name,StorageUsageBytes,Region

  echo ""
  log_info "Remaining tags in '${REPOSITORY}':"
  doctl registry repository list-tags "${REPOSITORY}" --format Tag,CompressedSize,UpdatedAt 2>/dev/null || \
    log_warn "Could not list tags (repository may be empty)."

  echo ""
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
main() {
  echo ""
  echo "================================================================"
  echo "  SafeTrekr Marketing -- DOCR Garbage Collection"
  echo "  Registry: ${REGISTRY_NAME}"
  echo "  Repository: ${REPOSITORY}"
  echo "  Retention: keep ${TAGS_TO_KEEP} most recent tags"
  echo "================================================================"
  echo ""

  preflight
  prune_tags
  run_garbage_collection
  report_storage

  echo "================================================================"
  log_info "Cleanup complete."
  echo "================================================================"
  echo ""
}

main "$@"
