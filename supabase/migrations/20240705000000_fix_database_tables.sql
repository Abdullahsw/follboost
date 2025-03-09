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
  proof_type TEXT DEFAULT 'text' CHECK (proof_type IN ('text', 'both')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  payment_method TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
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

-- Add to realtime publication if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE payment_options;
    ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Publication doesn't exist or other error, continue silently
END
$$;
