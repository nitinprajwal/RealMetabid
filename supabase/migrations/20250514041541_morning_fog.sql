/*
  # Initial Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `full_name` (text, nullable)
      - `email` (text, nullable)
      - `wallet_address` (text)
      - `coins` (integer)
    - `properties`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `name` (text)
      - `description` (text)
      - `photo_url` (text)
      - `square_footage` (integer, nullable)
      - `year_built` (integer, nullable)
      - `google_maps_url` (text, nullable)
      - `youtube_url` (text, nullable)
      - `amount` (integer)
      - `initial_bid` (integer)
      - `bid_increment` (integer)
      - `bid_end_date` (timestamptz)
      - `additional_info` (jsonb, nullable)
      - `owner_id` (uuid, references profiles.id)
      - `is_active` (boolean)
      - `highest_bidder_id` (uuid, references profiles.id, nullable)
      - `highest_bid` (integer, nullable)
    - `bids`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `property_id` (uuid, references properties.id)
      - `bidder_id` (uuid, references profiles.id)
      - `amount` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and write their own data
    - Add policies for public read access to properties
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  full_name text,
  email text,
  wallet_address text NOT NULL,
  coins integer DEFAULT 2000
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text NOT NULL,
  photo_url text NOT NULL,
  square_footage integer,
  year_built integer,
  google_maps_url text,
  youtube_url text,
  amount integer NOT NULL,
  initial_bid integer NOT NULL,
  bid_increment integer NOT NULL,
  bid_end_date timestamptz NOT NULL,
  additional_info jsonb,
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  is_active boolean DEFAULT true,
  highest_bidder_id uuid REFERENCES profiles(id),
  highest_bid integer
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read properties"
  ON properties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id OR auth.uid() = highest_bidder_id);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  property_id uuid REFERENCES properties(id) NOT NULL,
  bidder_id uuid REFERENCES profiles(id) NOT NULL,
  amount integer NOT NULL
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read bids"
  ON bids
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create bids"
  ON bids
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = bidder_id);

-- Create functions and triggers for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at
BEFORE UPDATE ON bids
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();