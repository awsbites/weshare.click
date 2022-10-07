#!/usr/bin/env bash

set -euo pipefail

packages="backend auth domain"
for package in $packages; do
  cd $package
  echo "😎 Deleting '$package'"
  sls remove
  cd ..
done
