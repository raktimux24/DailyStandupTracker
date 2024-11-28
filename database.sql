-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create standups table
CREATE TABLE standups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    yesterday TEXT NOT NULL,
    today TEXT NOT NULL,
    blockers TEXT,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER update_standups_updated_at
    BEFORE UPDATE ON standups
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Check existing policies
select *
from pg_policies
where tablename = 'profiles';

-- Drop existing policies if needed
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Profiles are viewable by everyone" on profiles;

-- Create new policies
create policy "Profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can insert their own profile"
on profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update using (auth.uid() = id);

-- Enable RLS if not already enabled
alter table profiles enable row level security;

-- Create RLS policies for standups
ALTER TABLE standups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all standups"
    ON standups FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own standups"
    ON standups FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own standups"
    ON standups FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own standups"
    ON standups FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);