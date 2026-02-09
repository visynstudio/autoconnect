-- Fix Seller Profile Data Saving Issue
-- Run this SQL in your Supabase Dashboard -> SQL Editor

-- 1. Ensure SELLERS table exists and has correct columns
create table if not exists public.sellers (
  id uuid references auth.users not null primary key,
  name text,
  phone text,
  city text,
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security (RLS)
alter table public.sellers enable row level security;

-- 3. Drop existing policies to avoid conflicts
drop policy if exists "Public sellers are viewable by everyone." on public.sellers;
drop policy if exists "Users can insert their own seller profile." on public.sellers;
drop policy if exists "Users can update their own seller profile." on public.sellers;

-- 4. Create Correct Policies

-- ALLOW SELECT: Authenticated users can see their own profile. Public can see all (start with public for simple marketplace logic).
create policy "Public sellers are viewable by everyone." 
on public.sellers for select 
using (true);

-- ALLOW INSERT: Authenticated users can insert their own profile.
-- CRITICAL FIX: The check (auth.uid() = id) ensures a user can only create their OWN record.
create policy "Users can insert their own seller profile." 
on public.sellers for insert 
with check (
  auth.uid() = id
);

-- ALLOW UPDATE: Authenticated users can update their own profile.
create policy "Users can update their own seller profile." 
on public.sellers for update 
using (
  auth.uid() = id
);

-- 5. Create a Trigger to auto-create seller profile on signup (Backup Mechanism)
-- This ensures that even if the client-side insert fails (e.g. network), the row is created.

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.sellers (id, name, phone, city)
  values (
    new.id, 
    new.raw_user_meta_data->>'name', 
    new.raw_user_meta_data->>'phone', 
    new.raw_user_meta_data->>'city'
  )
  on conflict (id) do nothing; -- Handle if client already inserted
  return new;
end;
$$ language plpgsql security definer; 
-- security definer allows the function to bypass RLS

-- Drop trigger if exists to avoid duplication errors
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
