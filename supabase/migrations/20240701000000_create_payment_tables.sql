-- Create payment_options table
CREATE TABLE IF NOT EXISTS payment_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  processing_fee DECIMAL(5,2) DEFAULT 0,
  min_amount DECIMAL(10,2) DEFAULT 0,
  max_amount DECIMAL(10,2) DEFAULT 0,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  payment_method TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  admin_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add balance column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'balance') THEN
    ALTER TABLE profiles ADD COLUMN balance DECIMAL(10,2) DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on payment_options
ALTER TABLE payment_options ENABLE ROW LEVEL SECURITY;

-- Enable RLS on transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_options
DROP POLICY IF EXISTS "Admins can manage payment options" ON payment_options;
CREATE POLICY "Admins can manage payment options"
  ON payment_options
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Users can view active payment options" ON payment_options;
CREATE POLICY "Users can view active payment options"
  ON payment_options FOR SELECT
  USING (is_active = true);

-- Create policies for transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all transactions" ON transactions;
CREATE POLICY "Admins can manage all transactions"
  ON transactions
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Add to realtime publication
alter publication supabase_realtime add table payment_options;
alter publication supabase_realtime add table transactions;
