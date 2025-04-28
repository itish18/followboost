/*
  # Initial schema for FollowBoost

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `name` (text)
      - `email` (text)
      - `company` (text)
      - `phone` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `followups`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `client_id` (uuid, foreign key to clients)
      - `subject` (text)
      - `content` (text)
      - `meeting_context` (text)
      - `status` (text)
      - `scheduled_date` (timestamp)
      - `sent_date` (timestamp)
      - `opened_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create followups table
CREATE TABLE IF NOT EXISTS followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  meeting_context TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_date TIMESTAMPTZ,
  sent_date TIMESTAMPTZ,
  opened_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE followups ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Clients policies
CREATE POLICY "Users can view their own clients"
  ON clients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON clients
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON clients
  FOR DELETE
  USING (auth.uid() = user_id);

-- Followups policies
CREATE POLICY "Users can view their own followups"
  ON followups
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own followups"
  ON followups
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own followups"
  ON followups
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own followups"
  ON followups
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_followups_updated_at
BEFORE UPDATE ON followups
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert trigger function for creating profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for inserting profile after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();