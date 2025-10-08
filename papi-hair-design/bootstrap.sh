#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE
Usage: $(basename "$0") [--force] [project-name]
  --force, -f       Remove existing destination before scaffolding
  --help, -h        Show this message
  project-name      Optional name for the generated Angular workspace (default: papi-hair-design)
USAGE
}

FORCE=false
PROJECT_NAME="papi-hair-design"

while [[ $# -gt 0 ]]; do
  case "$1" in
  -f|--force)
    FORCE=true
    shift
    ;;
  -h|--help)
    usage
    exit 0
    ;;
  *)
    if [[ "$1" == -* ]]; then
      echo "Unknown option: $1" >&2
      usage
      exit 1
    fi
    PROJECT_NAME="$1"
    shift
    ;;
  esac
done

ANGULAR_VERSION="${ANGULAR_VERSION:-17}"
ARCHIVE_FILE="scaffold.tar.gz.base64"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARCHIVE_PATH="${SCRIPT_DIR}/${ARCHIVE_FILE}"
DESTINATION="$(pwd)/${PROJECT_NAME}"

export npm_config_progress=false

if ! command -v ng >/dev/null 2>&1; then
  echo "Installing Angular CLI ${ANGULAR_VERSION}..."
  npm install -g "@angular/cli@${ANGULAR_VERSION}"
fi

if [ ! -f "${ARCHIVE_PATH}" ]; then
  echo "Scaffold archive not found at ${ARCHIVE_PATH}." >&2
  exit 1
fi

ARCHIVE_SOURCE="${ARCHIVE_PATH}"
TEMP_ARCHIVE=""

if [ -e "${DESTINATION}" ]; then
  if [ "${FORCE}" = true ]; then
    echo "Removing existing directory ${DESTINATION}..."
    TEMP_ARCHIVE="$(mktemp)"
    cp "${ARCHIVE_PATH}" "${TEMP_ARCHIVE}"
    ARCHIVE_SOURCE="${TEMP_ARCHIVE}"
    rm -rf "${DESTINATION}"
  else
    echo "Directory ${DESTINATION} already exists. Remove it, choose another name, or pass --force." >&2
    exit 1
  fi
fi

WORKDIR="$(mktemp -d)"
ARCHIVE_TMP="$(mktemp -d)"

cleanup() {
  rm -rf "${WORKDIR}" "${ARCHIVE_TMP}"
  if [ -n "${TEMP_ARCHIVE}" ] && [ -f "${TEMP_ARCHIVE}" ]; then
    rm -f "${TEMP_ARCHIVE}"
  fi
}

trap cleanup EXIT

pushd "${WORKDIR}" >/dev/null

ng new "${PROJECT_NAME}" \
  --standalone \
  --style=scss \
  --routing \
  --strict \
  --ssr=false \
  --package-manager npm \
  --skip-git \
  --skip-install

cd "${PROJECT_NAME}"

npm install --no-progress
npx ng add @angular/pwa --project "${PROJECT_NAME}" --skip-confirmation
npx ng add @angular-eslint/schematics --skip-confirmation
npm install --no-progress uuid
npm install --no-progress --save-dev prettier eslint-config-prettier eslint-plugin-prettier

base64 -d "${ARCHIVE_SOURCE}" > "${ARCHIVE_TMP}/scaffold.tar.gz"
tar -xzf "${ARCHIVE_TMP}/scaffold.tar.gz" -C "${ARCHIVE_TMP}"

rsync -a "${ARCHIVE_TMP}/papi-hair-design/" ./

npm install --no-progress

popd >/dev/null

mv "${WORKDIR}/${PROJECT_NAME}" "${DESTINATION}"

echo "✅ ${DESTINATION} ready."
echo "Run 'npm run start' inside the project to launch the dev server."
