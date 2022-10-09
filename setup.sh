#!/usr/bin/env bash

set -euo pipefail

echo "😎 Installing project dependencies for"
npm install

packages="auth backend domain"
for package in $packages; do
  cd $package
  echo "😎 Installing dependencies for '$package'"
  npm install
  cd ..
  echo ""
done