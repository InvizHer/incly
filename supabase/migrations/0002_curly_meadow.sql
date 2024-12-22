/*
  # Update Auth Schema

  1. Changes
    - Add safety checks for existing objects
    - Update user creation trigger with improved username handling
*/

-- Only create profiles table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Update the user creation function with improved username handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'username',
      'user_' || substr(new.id::text, 1, 8)
    ),
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safely recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();