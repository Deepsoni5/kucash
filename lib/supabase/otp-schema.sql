-- OTP Verifications Table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications(phone_number);
CREATE INDEX IF NOT EXISTS idx_otp_created_at ON otp_verifications(created_at DESC);

-- RLS
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on otp_verifications" ON otp_verifications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public select on otp_verifications" ON otp_verifications
  FOR SELECT
  TO anon
  USING (true); -- In production, you might want to restrict this
