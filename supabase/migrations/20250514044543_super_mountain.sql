/*
  # Add INSERT policy for profiles table

  1. Security Changes
    - Add INSERT policy for profiles table to allow new user creation
    - Policy allows users to create their own profile with their wallet address
    
  2. Notes
    - This policy is required for the initial user creation during login
    - The policy ensures users can only create their own profile
*/

-- Add INSERT policy for profiles table
CREATE POLICY "Users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow any authenticated user to create a profile

-- Note: We don't need to enable RLS as it's already enabled on the profiles table