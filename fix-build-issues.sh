#!/bin/bash

echo "Fixing build issues for FollBoost project..."

# Fix esbuild permissions
echo "Fixing esbuild permissions..."
chmod +x node_modules/@esbuild/linux-x64/bin/esbuild
chmod +x node_modules/.bin/*

# Fix TypeScript errors
echo "Running TypeScript type check..."
npx tsc --noEmit

# Run ESLint with auto-fix
echo "Running ESLint with auto-fix..."
npx eslint . --ext ts,tsx --fix

# Build the project
echo "Building the project..."
npm run build

echo "Build issues fixed successfully!"
