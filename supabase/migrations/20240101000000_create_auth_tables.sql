-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS VOID AS $$
DECLARE
    admin_exists BOOLEAN;
BEGIN
    -- Check if admin user already exists
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE email = 'ryyyjk@gmail.com'
    ) INTO admin_exists;
    
    -- If admin doesn't exist, create it
    IF NOT admin_exists THEN
        -- Insert admin user into profiles
        INSERT INTO public.profiles (id, full_name, email, role)
        VALUES (
            '00000000-0000-0000-0000-000000000000',
            'Admin User',
            'ryyyjk@gmail.com',
            'admin'
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute function to create admin user
SELECT create_admin_user();
