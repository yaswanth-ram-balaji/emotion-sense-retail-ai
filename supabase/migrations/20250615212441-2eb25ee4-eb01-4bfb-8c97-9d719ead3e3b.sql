
-- Enable row level security on public.profiles for security best practices
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Example: Allow users to view their own profile
CREATE POLICY "Users can view their own profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Example: Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Example: Allow users to insert their profile (already done by trigger, but policy required)
CREATE POLICY "Users can insert their profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Example: Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);
