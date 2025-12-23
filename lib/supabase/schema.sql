-- ============================================
-- KUCASH DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor to create the tables

-- 1. Loan Applications Table
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Loan Details
  loan_type TEXT NOT NULL, -- 'personal', 'business', 'property', 'working_capital', 'invoice', 'msme'
  loan_amount NUMERIC NOT NULL,
  loan_purpose TEXT,
  
  -- Employment/Business Details
  employment_type TEXT, -- 'salaried', 'self_employed', 'business'
  monthly_income NUMERIC,
  company_name TEXT,
  
  -- Additional Information
  city TEXT,
  state TEXT,
  pincode TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'under_review', 'approved', 'rejected'
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- 2. Create Index for faster queries
CREATE INDEX IF NOT EXISTS idx_loan_applications_email ON loan_applications(email);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_created_at ON loan_applications(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- 4. Create Policy to allow anyone to insert (for public form submissions)
CREATE POLICY "Allow public insert" ON loan_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Create Policy to allow authenticated users to read their own applications
CREATE POLICY "Users can view own applications" ON loan_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = email); -- Adjust this based on your auth setup

-- 6. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_loan_applications_updated_at
  BEFORE UPDATE ON loan_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- OPTIONAL: Contact Form Submissions Table
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  
  status TEXT DEFAULT 'new', -- 'new', 'read', 'replied'
  
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on contact" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================
-- OPTIONAL: Newsletter Subscriptions Table
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'unsubscribed'
  
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on newsletter" ON newsletter_subscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);
