-- ============================================================
-- Wedding Media QR Platform — Clean Re-runnable Setup
-- Paste into Supabase SQL Editor and run
-- ============================================================

create extension if not exists pgcrypto;

drop trigger if exists weddings_updated_at on public.weddings;
drop trigger if exists on_auth_user_created on auth.users;

drop policy if exists "storage: admin insert" on storage.objects;
drop policy if exists "storage: admin update" on storage.objects;
drop policy if exists "storage: admin delete" on storage.objects;
drop policy if exists "storage: authenticated read" on storage.objects;
drop policy if exists "storage: covers public read" on storage.objects;

drop table if exists public.download_logs  cascade;
drop table if exists public.favorites      cascade;
drop table if exists public.qr_links       cascade;
drop table if exists public.media_files    cascade;
drop table if exists public.albums         cascade;
drop table if exists public.wedding_access cascade;
drop table if exists public.weddings       cascade;
drop table if exists public.users          cascade;

drop type if exists public.user_role      cascade;
drop type if exists public.wedding_status cascade;
drop type if exists public.access_type    cascade;
drop type if exists public.visibility     cascade;
drop type if exists public.media_type     cascade;
drop type if exists public.qr_link_type   cascade;

drop function if exists public.handle_updated_at() cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.get_my_role() cascade;

create type public.user_role      as enum ('admin', 'couple', 'guest');
create type public.wedding_status as enum ('draft', 'active', 'delivered', 'archived');
create type public.access_type    as enum ('owner', 'couple', 'guest');
create type public.visibility     as enum ('private', 'couple_only', 'guest_visible');
create type public.media_type     as enum ('image', 'video');
create type public.qr_link_type   as enum ('full_gallery', 'album', 'guest_gallery');

create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  email      text not null unique,
  role       public.user_role not null default 'guest',
  created_at timestamptz not null default now()
);

create table public.weddings (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  bride_name      text not null,
  groom_name      text not null,
  event_date      date not null,
  venue           text not null,
  cover_image_url text,
  status          public.wedding_status not null default 'draft',
  created_by      uuid not null references public.users(id) on delete restrict,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.wedding_access (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  access_type public.access_type not null,
  created_at  timestamptz not null default now(),
  unique(wedding_id, user_id)
);

create table public.albums (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references public.weddings(id) on delete cascade,
  title       text not null,
  description text,
  slug        text not null,
  visibility  public.visibility not null default 'private',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  unique(wedding_id, slug)
);

create table public.media_files (
  id              uuid primary key default gen_random_uuid(),
  wedding_id      uuid not null references public.weddings(id) on delete cascade,
  album_id        uuid references public.albums(id) on delete set null,
  media_type      public.media_type not null,
  file_url        text not null,
  thumbnail_url   text,
  file_name       text not null,
  mime_type       text not null,
  file_size_bytes bigint not null default 0,
  visibility      public.visibility not null default 'private',
  downloadable    boolean not null default false,
  uploaded_by     uuid not null references public.users(id) on delete restrict,
  created_at      timestamptz not null default now()
);

create table public.qr_links (
  id         uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  album_id   uuid references public.albums(id) on delete cascade,
  token      text not null unique,
  link_type  public.qr_link_type not null default 'full_gallery',
  is_active  boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  media_id   uuid not null references public.media_files(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, media_id)
);

create table public.download_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.users(id) on delete set null,
  media_id      uuid not null references public.media_files(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create index idx_weddings_created_by         on public.weddings(created_by);
create index idx_albums_wedding_id           on public.albums(wedding_id);
create index idx_media_files_wedding_id      on public.media_files(wedding_id);
create index idx_media_files_album_id        on public.media_files(album_id);
create index idx_qr_links_token              on public.qr_links(token);
create index idx_favorites_user_id           on public.favorites(user_id);
create index idx_wedding_access_wedding_user on public.wedding_access(wedding_id, user_id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'guest'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

create or replace function public.get_my_role()
returns public.user_role
language sql
security definer
stable
set search_path = public
as $$
  select role
  from public.users
  where id = auth.uid()
$$;

create trigger weddings_updated_at
before update on public.weddings
for each row execute function public.handle_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.users          enable row level security;
alter table public.weddings       enable row level security;
alter table public.wedding_access enable row level security;
alter table public.albums         enable row level security;
alter table public.media_files    enable row level security;
alter table public.qr_links       enable row level security;
alter table public.favorites      enable row level security;
alter table public.download_logs  enable row level security;

create policy "users: self select"
  on public.users
  for select
  using (auth.uid() = id);

create policy "users: self update"
  on public.users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users: admin select all"
  on public.users
  for select
  using (public.get_my_role() = 'admin');

create policy "weddings: admin all"
  on public.weddings
  for all
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

create policy "weddings: assigned user select"
  on public.weddings
  for select
  using (
    exists (
      select 1
      from public.wedding_access wa
      where wa.wedding_id = public.weddings.id
        and wa.user_id = auth.uid()
    )
  );

create policy "wedding_access: admin all"
  on public.wedding_access
  for all
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

create policy "wedding_access: self select"
  on public.wedding_access
  for select
  using (auth.uid() = user_id);

create policy "albums: admin all"
  on public.albums
  for all
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

create policy "albums: assigned user select"
  on public.albums
  for select
  using (
    exists (
      select 1
      from public.wedding_access wa
      where wa.wedding_id = public.albums.wedding_id
        and wa.user_id = auth.uid()
    )
    and (
      public.albums.visibility = 'couple_only'
      or public.albums.visibility = 'guest_visible'
    )
  );

create policy "media: admin all"
  on public.media_files
  for all
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

create policy "media: assigned user select"
  on public.media_files
  for select
  using (
    exists (
      select 1
      from public.wedding_access wa
      where wa.wedding_id = public.media_files.wedding_id
        and wa.user_id = auth.uid()
    )
    and (
      public.media_files.visibility = 'couple_only'
      or public.media_files.visibility = 'guest_visible'
    )
  );

create policy "qr_links: admin all"
  on public.qr_links
  for all
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

create policy "qr_links: active select"
  on public.qr_links
  for select
  using (is_active = true);

create policy "favorites: self all"
  on public.favorites
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "download_logs: admin select"
  on public.download_logs
  for select
  using (public.get_my_role() = 'admin');

create policy "download_logs: authenticated insert"
  on public.download_logs
  for insert
  with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('wedding-media', 'wedding-media', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

create policy "storage: admin insert"
  on storage.objects
  for insert
  with check (
    bucket_id in ('wedding-media', 'covers')
    and public.get_my_role() = 'admin'
  );

create policy "storage: admin update"
  on storage.objects
  for update
  using (
    bucket_id in ('wedding-media', 'covers')
    and public.get_my_role() = 'admin'
  );

create policy "storage: admin delete"
  on storage.objects
  for delete
  using (
    bucket_id in ('wedding-media', 'covers')
    and public.get_my_role() = 'admin'
  );

create policy "storage: authenticated read"
  on storage.objects
  for select
  using (
    (bucket_id = 'wedding-media' and auth.role() = 'authenticated')
    or bucket_id = 'covers'
  );

update public.users
set role = 'admin'
where email = 'admin@gmail.com';

-- Quick checks:
-- select id, email, role from public.users;
-- select * from public.wedding_access;
