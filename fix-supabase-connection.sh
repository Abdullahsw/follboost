#!/bin/bash

# Script to fix Supabase connection issues

echo "===== Fixing Supabase Connection Issues ====="

# Check if dig command is available
if ! command -v dig &> /dev/null; then
  echo "Installing dig (dnsutils)..."
  apt-get update && apt-get install -y dnsutils
fi

# Get Supabase URL from .env file
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)

# Extract domain from URL
DOMAIN=$(echo $SUPABASE_URL | sed -e 's|^[^/]*//||' -e 's|/.*$||')

echo "Supabase domain: $DOMAIN"

# Try to get IP address
IP=$(dig +short $DOMAIN)

if [ -z "$IP" ]; then
  echo "Could not resolve IP address for $DOMAIN"
  echo "Using fallback method..."
  
  # Try to get IP from a public DNS server
  IP=$(dig @8.8.8.8 +short $DOMAIN)
  
  if [ -z "$IP" ]; then
    echo "Still could not resolve IP. Using hardcoded IPs for Supabase..."
    # These are example IPs - they may not be accurate for your specific Supabase instance
    IP="104.18.0.52"
  fi
fi

echo "IP address for $DOMAIN: $IP"

# Add entry to hosts file if it doesn't exist
if ! grep -q "$DOMAIN" /etc/hosts; then
  echo "Adding entry to /etc/hosts..."
  echo "$IP $DOMAIN" | tee -a /etc/hosts
fi

# Test connection
echo "Testing connection to Supabase..."
curl -s -o /dev/null -w "%{http_code}\n" $SUPABASE_URL

echo "\nDone! Please restart your application."
