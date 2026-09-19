#!/usr/bin/env bash
# Builds the Assemble3 editor (editor/newIDE/app) for https://<host>/editor/
# and copies the result into public/editor. Run from the repo root, with
# Git Bash on Windows or bash on Linux. Takes a while (webpack production build).
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

cd editor/newIDE/app
[ -d node_modules ] || npm ci
export PUBLIC_URL=/editor
export MSYS_NO_PATHCONV=1 # Git Bash would turn /editor into a Windows path
npm run build:editor

cd "$ROOT"
rm -rf public/editor
mkdir -p public/editor
cp -r editor/newIDE/app/build/. public/editor/
echo "Editor copied to public/editor ($(du -sh public/editor | cut -f1))."
echo "Deploy: rsync -az --delete public/editor/ ubuntu@<ec2>:/var/www/assemble/public/editor/"
