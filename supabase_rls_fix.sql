-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Policy: Allow service role (admin) full access (implicitly true, but good to know)
-- No explicit policy needed for service_role as it bypasses RLS, but if using authenticated client for admin tasks:

-- Optional: Allow read access to everyone if profiles are public (e.g. usernames)
-- CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
