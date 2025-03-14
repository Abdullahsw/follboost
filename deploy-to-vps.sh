#!/bin/bash

echo "Starting deployment process for FollBoost..."

# Step 1: Clean up and reinstall dependencies
echo "Cleaning up old dependencies..."
rm -rf node_modules dist

echo "Installing dependencies..."
npm install

# Step 2: Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "Build failed! Dist directory not found."
  exit 1
fi

# Check if CSS file exists and has content
CSS_FILE=$(find dist/assets -name "*.css" | head -n 1)
if [ -z "$CSS_FILE" ] || [ ! -s "$CSS_FILE" ]; then
  echo "Warning: CSS file is empty or not found!"
  # Try to fix CSS issue by rebuilding with explicit CSS import
  echo "Attempting to fix CSS issue..."
  echo "// Ensure CSS is imported" > src/css-fix.ts
  echo "import './index.css';" >> src/css-fix.ts
  echo "import '@/index.css';" >> src/css-fix.ts
  
  # Add import to main.tsx
  sed -i "1s/^/import \".\/css-fix\";\n/" src/main.tsx
  
  # Rebuild
  npm run build
  
  # Check again
  CSS_FILE=$(find dist/assets -name "*.css" | head -n 1)
  if [ -z "$CSS_FILE" ] || [ ! -s "$CSS_FILE" ]; then
    echo "CSS file is still empty or not found after fix attempt."
    echo "Please check your CSS configuration manually."
  else
    echo "CSS issue fixed successfully!"
  fi
fi

# Step 3: Copy files to web server directory
echo "Copying files to web server directory..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Step 4: Set correct permissions
echo "Setting correct permissions..."
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Step 5: Copy Nginx configuration
echo "Updating Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/follboost.com.conf

# Check if the site is enabled, if not, enable it
if [ ! -f "/etc/nginx/sites-enabled/follboost.com.conf" ]; then
  echo "Enabling site in Nginx..."
  sudo ln -s /etc/nginx/sites-available/follboost.com.conf /etc/nginx/sites-enabled/
fi

# Step 6: Test and restart Nginx
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
  echo "Nginx configuration is valid. Restarting Nginx..."
  sudo systemctl restart nginx
  echo "Deployment completed successfully!"
  echo "You can now access your website at http://follboost.com and https://follboost.com"
else
  echo "Nginx configuration test failed. Please check the configuration manually."
  exit 1
fi
