-- Add missing columns to payment_options table if they don't exist
ALTER TABLE payment_options ADD COLUMN IF NOT EXISTS requires_proof BOOLEAN DEFAULT TRUE;
ALTER TABLE payment_options ADD COLUMN IF NOT EXISTS proof_instructions TEXT DEFAULT 'يرجى إدخال رقم العملية أو معلومات إضافية عن الدفع';
ALTER TABLE payment_options ADD COLUMN IF NOT EXISTS proof_type TEXT DEFAULT 'text' CHECK (proof_type IN ('text', 'both'));

-- Add missing columns to transactions table if they don't exist
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_proof_image TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_proof_text TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add to realtime publication
alter publication supabase_realtime add table payment_options;
alter publication supabase_realtime add table transactions;
