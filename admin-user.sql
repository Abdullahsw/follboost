-- Insert admin user into auth.users table
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'ryyyjk@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"مدير النظام"}'
)
ON CONFLICT (email) DO NOTHING;

-- Get the user ID
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'ryyyjk@gmail.com';
  
  -- Insert into profiles table with admin role
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (user_id, 'مدير النظام', 'ryyyjk@gmail.com', 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
END
$$;
