#!/usr/bin/env bash

echo "😎 Installing project dependencies for"
npm install

packages="auth backend cli domain"
for package in $packages; do
  cd $package
  echo "😎 Installing dependencies for '$package'"
  npm install
  cd ..
done