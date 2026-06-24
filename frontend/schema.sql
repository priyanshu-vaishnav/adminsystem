

drop table if exists indents;
drop table if exists profiles cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

-- supabase auth.users ke liye 
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user', -- 'user' or 'admin'
  created_at timestamp with time zone default now()
);

--  new user onboarding requests
-- A non-logged-in admins to request a new account.
-- Real auth account only gets created when status becomes 'approved'.
create table indents (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  username text not null,
  email text not null,
  password text not null, -- plain text for demo s
  status text default 'pending', -- pending / approved / rejected
  created_at timestamp with time zone default now()
);

-- Allow public read/write for demo speed 
alter table profiles enable row level security;
alter table indents enable row level security;

create policy "allow all profiles" on profiles for all using (true) with check (true);
create policy "allow all indents" on indents for all using (true) with check (true);

-- Auto-create profile on signup (fires when a user is actually created,
-- e.g. when an indent gets approved and signUp() runs)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (new.id, new.raw_user_meta_data->>'name', new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
