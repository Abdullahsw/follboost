-- Create a storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
CREATE POLICY "Anyone can upload payment proofs" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'payment_proofs');

CREATE POLICY "Anyone can view payment proofs" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'payment_proofs');

CREATE POLICY "Authenticated users can update their own payment proofs" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'payment_proofs' AND auth.uid() = owner);

CREATE POLICY "Authenticated users can delete their own payment proofs" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'payment_proofs' AND auth.uid() = owner);

-- Add to realtime publication
alter publication supabase_realtime add table storage.objects;
