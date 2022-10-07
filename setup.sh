#!/usr/bin/env bash

packages="auth backend cli domain"
for package in $packages; do
  cd $package
  echo "😎 Installing dependencies for '$package'"
  npm install
  cd ..
done