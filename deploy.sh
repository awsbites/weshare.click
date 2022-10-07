#!/usr/bin/env bash

set -euo pipefail

packages="domain auth backend"
for package in $packages; do
  cd $package
  echo "😎 Deploying '$package'"
  sls deploy
  cd ..
done
