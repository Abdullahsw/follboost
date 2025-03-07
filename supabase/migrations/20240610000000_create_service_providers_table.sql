-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    api_url VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage service providers
DROP POLICY IF EXISTS "Admins can manage service providers";
CREATE POLICY "Admins can manage service providers"
    ON service_providers
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Add to realtime publication
alter publication supabase_realtime add table service_providers;
