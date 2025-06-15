
-- 1. User Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text
);

-- Add trigger to auto-create a profile row after user signs up (optional, see docs for customization)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Roles enum and table
create type public.app_role as enum ('admin', 'manager', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Allow users to see and manage their own roles
create policy "Users can view their own roles"
  on public.user_roles
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own role"
  on public.user_roles
  for insert
  with check (auth.uid() = user_id);

-- 3. Add emotion log table (example app data)
create table public.emotion_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  emotion text not null,
  confidence float,
  type text not null, -- entry or exit
  created_at timestamp with time zone default now()
);

-- Enable RLS on emotion_logs
alter table public.emotion_logs enable row level security;

-- Allow users to view/insert/update/delete their own emotion logs
create policy "Users can view their own logs"
  on public.emotion_logs for select using (auth.uid() = user_id);
create policy "Users can insert their own logs"
  on public.emotion_logs for insert with check (auth.uid() = user_id);
create policy "Users can update their own logs"
  on public.emotion_logs for update using (auth.uid() = user_id);
create policy "Users can delete their own logs"
  on public.emotion_logs for delete using (auth.uid() = user_id);

-- 4. Create a public storage bucket for uploads (images, documents, etc.)
insert into storage.buckets (id, name, public) values ('user-uploads', 'user-uploads', true)
on conflict (id) do nothing;
