#!/usr/bin/env bash

set -euo pipefail

packages="domain auth backend"
for package in $packages; do
  cd $package
  echo "😎 Deploying '$package'"
  npx serverless deploy
  cd ..
  echo ""
done
