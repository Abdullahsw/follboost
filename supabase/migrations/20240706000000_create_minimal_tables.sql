-- Create minimal tables needed for the app to function

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_options table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  processing_fee NUMERIC DEFAULT 0,
  min_amount NUMERIC DEFAULT 0,
  max_amount NUMERIC DEFAULT 0,
  instructions TEXT,
  requires_proof BOOLEAN DEFAULT TRUE,
  proof_instructions TEXT DEFAULT 'يرجى إدخال رقم العملية أو معلومات إضافية عن الدفع',
  proof_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  payment_method TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  processing_fee NUMERIC DEFAULT 0,
  payment_proof_image TEXT,
  payment_proof_text TEXT,
  payment_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  verified_by UUID,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service_providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  api_url TEXT NOT NULL,
  api_key TEXT NOT NULL,
  api_secret TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a default payment method if none exists
INSERT INTO payment_options (name, description, is_active, processing_fee, min_amount, max_amount, instructions, requires_proof)
SELECT 'تحويل بنكي', 'تحويل مباشر إلى الحساب البنكي', TRUE, 0, 50, 10000, 'قم بالتحويل إلى الحساب التالي:\nبنك الراجحي\nرقم الحساب: SA0000000000000000000000\nاسم المستفيد: شركة فول بوست', TRUE
WHERE NOT EXISTS (SELECT 1 FROM payment_options LIMIT 1);
