#!/bin/bash

# === Configuration ===
PROJECT_PATH="/Users/users-MacBook-Air/Final Project"  # ← yahan correct path
GITHUB_REPO="https://github.com/Talha-4876/food-delivery-app.git" # GitHub repo URL

# === Start Script ===
echo "Navigating to project folder..."
cd "$PROJECT_PATH" || { echo "Folder not found!"; exit 1; }

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "Initializing git..."
    git init
fi

# Stage all files
echo "Adding all files..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit: added all project files"

# Add remote if not already added
if ! git remote | grep -q origin; then
    echo "Adding GitHub remote..."
    git remote add origin "$GITHUB_REPO"
fi

# Rename branch to main
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "✅ Project pushed to GitHub successfully!"