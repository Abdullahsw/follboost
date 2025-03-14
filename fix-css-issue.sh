#!/bin/bash

echo "Fixing CSS build issues for FollBoost..."

# Step 1: Check if postcss.config.js exists and has correct content
if [ ! -f "postcss.config.js" ] || [ ! -s "postcss.config.js" ]; then
  echo "Creating/updating postcss.config.js..."
  cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
fi

# Step 2: Check if tailwind.config.js exists and has correct content
if [ ! -f "tailwind.config.js" ] || [ ! -s "tailwind.config.js" ]; then
  echo "Creating/updating tailwind.config.js..."
  cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF
fi

# Step 3: Ensure CSS is properly imported in main.tsx
if ! grep -q "import.*index.css" src/main.tsx; then
  echo "Adding CSS import to main.tsx..."
  sed -i '1s/^/import ".\/index.css";\n/' src/main.tsx
fi

# Step 4: Check if index.css exists and has tailwind directives
if [ ! -f "src/index.css" ] || ! grep -q "@tailwind" src/index.css; then
  echo "Updating index.css with Tailwind directives..."
  cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom CSS goes here */
EOF
fi

# Step 5: Reinstall dependencies
echo "Reinstalling dependencies..."
npm install tailwindcss autoprefixer postcss --save-dev

# Step 6: Rebuild the project
echo "Rebuilding the project..."
npm run build

# Check if CSS file exists and has content
CSS_FILE=$(find dist/assets -name "*.css" | head -n 1)
if [ -z "$CSS_FILE" ] || [ ! -s "$CSS_FILE" ]; then
  echo "Warning: CSS file is still empty or not found after fixes!"
  echo "Additional debugging information:"
  echo "-----------------------------------"
  echo "Content of postcss.config.js:"
  cat postcss.config.js
  echo "-----------------------------------"
  echo "Content of tailwind.config.js:"
  cat tailwind.config.js
  echo "-----------------------------------"
  echo "First few lines of index.css:"
  head -n 10 src/index.css
  echo "-----------------------------------"
  echo "Please check your CSS configuration manually."
else
  echo "CSS issue fixed successfully! CSS file: $CSS_FILE"
  echo "CSS file size: $(du -h "$CSS_FILE" | cut -f1)"
fi
