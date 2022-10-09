#!/usr/bin/env bash

set -euo pipefail

packages="backend auth domain"
for package in $packages; do
  cd $package
  echo "😎 Deleting '$package'"
  npx serverless remove
  cd ..
  echo ""
done
