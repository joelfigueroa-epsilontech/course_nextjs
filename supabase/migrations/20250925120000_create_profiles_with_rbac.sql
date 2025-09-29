-- Migration: Create profiles table with RBAC roles
-- Purpose: Establish user profiles with role-based access control
-- Tables affected: profiles (created)
-- Roles: 'admin' and 'user' with 'user' as default

-- create an enum for user roles to ensure data integrity
create type user_role as enum ('user', 'admin');

-- create profiles table to extend auth.users with additional user information
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role user_role not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- enable row level security on profiles table
alter table public.profiles enable row level security;

-- create rls policies for profiles table

-- policy: users can view their own profile
create policy "Users can view own profile" on public.profiles
  for select
  to authenticated
  using ( (select auth.uid()) = id );

-- policy: users can insert their own profile
create policy "Users can insert own profile" on public.profiles
  for insert
  to authenticated
  with check ( (select auth.uid()) = id );

-- policy: users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- policy: only admins can view all profiles
create policy "Admins can view all profiles" on public.profiles
  for select
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: only admins can update any profile
create policy "Admins can update any profile" on public.profiles
  for update
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check ( true );

-- policy: only admins can delete profiles
create policy "Admins can delete profiles" on public.profiles
  for delete
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- create function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- create trigger to automatically create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- create function to update profile updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- create trigger to automatically update updated_at on profile changes
create trigger handle_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- create indexes for better performance on common queries
create index profiles_role_idx on public.profiles (role);
create index profiles_email_idx on public.profiles (email);

-- grant usage on the user_role enum to authenticated users
grant usage on type user_role to authenticated;

-- add comment to document the table purpose
comment on table public.profiles is 'User profiles with role-based access control. Automatically created when a user signs up.';
comment on column public.profiles.role is 'User role for RBAC: user (default) or admin';
