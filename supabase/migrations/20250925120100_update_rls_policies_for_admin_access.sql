-- Migration: Update RLS policies to allow admin role full access
-- Purpose: Grant admin users full access to all data in the application
-- Tables affected: blogs, chats, messages
-- Admin users will bypass normal RLS restrictions

-- update blogs table rls policies to allow admin full access

-- policy: admins can view all blogs
create policy "Admins can view all blogs" on public.blogs
  for select
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can insert any blog
create policy "Admins can insert any blog" on public.blogs
  for insert
  to authenticated
  with check ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can update any blog
create policy "Admins can update any blog" on public.blogs
  for update
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can delete any blog
create policy "Admins can delete any blog" on public.blogs
  for delete
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- update chats table rls policies to allow admin full access

-- policy: admins can view all chats
create policy "Admins can view all chats" on public.chats
  for select
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can insert any chat
create policy "Admins can insert any chat" on public.chats
  for insert
  to authenticated
  with check ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can update any chat
create policy "Admins can update any chat" on public.chats
  for update
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can delete any chat
create policy "Admins can delete any chat" on public.chats
  for delete
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- update messages table rls policies to allow admin full access

-- policy: admins can view all messages
create policy "Admins can view all messages" on public.messages
  for select
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can insert any message
create policy "Admins can insert any message" on public.messages
  for insert
  to authenticated
  with check ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can update any message
create policy "Admins can update any message" on public.messages
  for update
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- policy: admins can delete any message
create policy "Admins can delete any message" on public.messages
  for delete
  to authenticated
  using ( 
    exists (
      select 1 from public.profiles 
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- add comments to document the admin access policies
comment on policy "Admins can view all blogs" on public.blogs is 'Admin users have full read access to all blog posts';
comment on policy "Admins can view all chats" on public.chats is 'Admin users have full read access to all user chats';
comment on policy "Admins can view all messages" on public.messages is 'Admin users have full read access to all chat messages';
