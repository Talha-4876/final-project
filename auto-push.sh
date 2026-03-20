#!/bin/bash

# ===============================
# Auto push Final Project to GitHub (Mac)
# ===============================

# --- Configure variables ---
# Replace below with your GitHub username and repo
GITHUB_USERNAME="Talha-4876"
GITHUB_REPO="food-delivery-app"

# Replace below with your **actual Personal Access Token** from GitHub


# --- Start ---
echo "🚀 Pushing Final Project to GitHub..."

# Ensure we are in current folder
echo "Using folder: $(pwd)"

# Initialize git if not already
if [ ! -d ".git" ]; then
    git init
    echo "Initialized new Git repository."
fi

# Stage all files
git add .

# Commit changes with timestamp
git commit -m "Auto commit: $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nothing to commit."

# Remove old remote if exists
git remote remove origin 2>/dev/null

# Set remote URL with token embedded (so no prompt appears)
git remote add origin https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$GITHUB_REPO.git

# Rename current branch to main
git branch -M main

# Push to GitHub
git push -u origin main

echo "✅ Project pushed to GitHub successfully!"