#!/bin/bash

# DNS Troubleshooting Script for Supabase Connection

echo "===== DNS Troubleshooting for Supabase Connection ====="
echo "Testing connection to Supabase URL..."

# Get Supabase URL from .env file
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env | cut -d '=' -f2)

# Extract domain from URL
DOMAIN=$(echo $SUPABASE_URL | sed -e 's|^[^/]*//||' -e 's|/.*$||')

echo "Supabase domain: $DOMAIN"

# Check if domain resolves
echo "\nTesting DNS resolution..."
host $DOMAIN
if [ $? -ne 0 ]; then
  echo "DNS resolution failed. Adding entry to /etc/hosts file might help."
else
  echo "DNS resolution successful."
fi

# Test connection with curl
echo "\nTesting connection with curl..."
curl -v $SUPABASE_URL

# Check if DNS servers are working properly
echo "\nChecking DNS servers..."
cat /etc/resolv.conf

# Suggest solutions
echo "\n===== Possible Solutions ====="
echo "1. If DNS resolution failed, add the following to your /etc/hosts file:"
echo "   <IP_ADDRESS> $DOMAIN"
echo "   (You can find the IP address by running: dig $DOMAIN from another machine)"
echo "2. Check if your server has internet access"
echo "3. Try using a public DNS server like Google (8.8.8.8) or Cloudflare (1.1.1.1)"
echo "4. Check if your firewall is blocking outgoing connections"
echo "5. Verify that the Supabase service is up by visiting: https://status.supabase.com"
