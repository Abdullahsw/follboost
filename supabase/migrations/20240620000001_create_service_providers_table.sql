CREATE TABLE IF NOT EXISTS service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    api_url VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;

-- Create policy for full access to authenticated users
DROP POLICY IF EXISTS "Authenticated users can perform all operations on service_providers";
CREATE POLICY "Authenticated users can perform all operations on service_providers"
ON service_providers
FOR ALL
TO authenticated
USING (true);

-- Enable realtime
alter publication supabase_realtime add table service_providers;