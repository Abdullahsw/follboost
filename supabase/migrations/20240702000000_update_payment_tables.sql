-- Add proof-related columns to payment_options table
ALTER TABLE payment_options ADD COLUMN IF NOT EXISTS requires_proof BOOLEAN DEFAULT TRUE;
ALTER TABLE payment_options ADD COLUMN IF NOT EXISTS proof_instructions TEXT DEFAULT 'يرجى إرفاق صورة إيصال الدفع أو رقم العملية';
ALTER TABLE payment_options ADD COLUMN IF NOT EXISTS proof_type TEXT DEFAULT 'image' CHECK (proof_type IN ('image', 'text', 'both'));

-- Add proof-related columns to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_proof_image TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_proof_text TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id);

-- Add to realtime publication
alter publication supabase_realtime add table payment_options;
alter publication supabase_realtime add table transactions;
