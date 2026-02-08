-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create SELLERS table
-- USE EXACTLY AS REQUESTED
create table public.sellers (
  id uuid references auth.users not null primary key,
  name text,
  phone text,
  city text,
  created_at timestamptz default now()
);

-- 2. Create VEHICLES table
-- USE EXACTLY AS REQUESTED
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.sellers(id) on delete cascade not null,
  vehicle_type text not null, -- flexible category system as requested
  brand text not null,
  model text not null,
  year int not null,
  km_driven int not null,
  fuel_type text check (fuel_type in ('petrol', 'diesel', 'electric', 'cng', 'hybrid')),
  price numeric not null,
  location text not null,
  description text,
  is_live boolean default true,
  created_at timestamptz default now()
);

-- 3. Create VEHICLE_IMAGES table
-- USE EXACTLY AS REQUESTED
create table public.vehicle_images (
  id uuid default gen_random_uuid() primary key,
  vehicle_id uuid references public.vehicles(id) on delete cascade not null,
  image_url text not null,
  created_at timestamptz default now()
);

-- Security: Enable RLS
alter table public.sellers enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_images enable row level security;

-- Policies for SELLERS
-- Anyone can view seller profiles (needed for vehicle details page)
create policy "Public sellers are viewable by everyone." on public.sellers for select using (true);
-- Users can insert their own profile
create policy "Users can insert their own seller profile." on public.sellers for insert with check (auth.uid() = id);
-- Users can update their own profile
create policy "Users can update their own seller profile." on public.sellers for update using (auth.uid() = id);

-- Policies for VEHICLES
-- Anyone can view live vehicles
create policy "Live vehicles are viewable by everyone." on public.vehicles for select using (true);
-- Sellers see all their own vehicles (even if is_live=false)
create policy "Sellers see all their own vehicles." on public.vehicles for select using (auth.uid() = seller_id);
-- Sellers can insert their own vehicles
create policy "Sellers can insert their own vehicles." on public.vehicles for insert with check (auth.uid() = seller_id);
-- Sellers can update their own vehicles
create policy "Sellers can update their own vehicles." on public.vehicles for update using (auth.uid() = seller_id);
-- Sellers can delete their own vehicles
create policy "Sellers can delete their own vehicles." on public.vehicles for delete using (auth.uid() = seller_id);

-- Policies for VEHICLE_IMAGES
-- Anyone can view images
create policy "Images are viewable by everyone." on public.vehicle_images for select using (true);
-- Sellers can insert images only for their own vehicles
create policy "Sellers can insert images" on public.vehicle_images for insert with check (
  exists (select 1 from public.vehicles where id = vehicle_id and seller_id = auth.uid())
);
-- Sellers can delete images 
create policy "Sellers can delete images" on public.vehicle_images for delete using (
  exists (select 1 from public.vehicles where id = vehicle_id and seller_id = auth.uid())
);

-- Storage Setup
-- This part creates the bucket if your SQL editor supports it, 
-- otherwise create 'vehicle-images' (public) manually in the Storage tab.
insert into storage.buckets (id, name, public) values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'vehicle-images' );
create policy "Authenticated users can upload" on storage.objects for insert with check ( bucket_id = 'vehicle-images' and auth.role() = 'authenticated' );
create policy "Users can update own" on storage.objects for update using ( bucket_id = 'vehicle-images' and auth.uid() = owner );
create policy "Users can delete own" on storage.objects for delete using ( bucket_id = 'vehicle-images' and auth.uid() = owner );
