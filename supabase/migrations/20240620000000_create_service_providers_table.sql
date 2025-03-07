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

alter publication supabase_realtime add table service_providers;