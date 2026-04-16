-- ============================================================
-- Wedding Media QR Platform — Full Schema
-- Safe to re-run: drops everything and rebuilds from scratch
-- ============================================================

-- Drop everything in reverse dependency order
DROP TABLE IF EXISTS public.favorites         CASCADE;
DROP TABLE IF EXISTS public.guest_tokens      CASCADE;
DROP TABLE IF EXISTS public.media_files       CASCADE;
DROP TABLE IF EXISTS public.albums            CASCADE;
DROP TABLE IF EXISTS public.wedding_couples   CASCADE;
DROP TABLE IF EXISTS public.weddings          CASCADE;
DROP TABLE IF EXISTS public.users             CASCADE;
DROP FUNCTION IF EXISTS public.get_my_role()  CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================================
-- USERS
-- Only admin and couple accounts. Guests never land here.
-- ============================================================
CREATE TABLE public.users (
  id          uuid        PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email       text        NOT NULL,
  full_name   text        NOT NULL DEFAULT '',
  role        text        NOT NULL DEFAULT 'couple'
                          CHECK (role IN ('admin', 'couple')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION: get_my_role
-- Defined AFTER users table so the reference is valid.
-- Security definer bypasses RLS → no infinite recursion.
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Each user can read and update their own row
CREATE POLICY "users: select own"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users: update own"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can read + update everyone
CREATE POLICY "admin: select all users"
  ON public.users FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "admin: update all users"
  ON public.users FOR UPDATE
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

-- Trigger: auto-insert into public.users on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'couple'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- WEDDINGS
-- ============================================================
CREATE TABLE public.weddings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL,
  bride_name  text        NOT NULL DEFAULT '',
  groom_name  text        NOT NULL DEFAULT '',
  event_date  date,
  venue       text        NOT NULL DEFAULT '',
  status      text        NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft','active','delivered','archived')),
  cover_url   text,
  created_by  uuid        NOT NULL REFERENCES public.users ON DELETE RESTRICT,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin: all weddings"
  ON public.weddings FOR ALL
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

-- Couple read policy added after wedding_couples is created (below)

-- ============================================================
-- WEDDING_COUPLES  (couple accounts ↔ wedding assignment)
-- ============================================================
CREATE TABLE public.wedding_couples (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  uuid        NOT NULL REFERENCES public.weddings ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES public.users ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wedding_id, user_id)
);

ALTER TABLE public.wedding_couples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin: all wedding_couples"
  ON public.wedding_couples FOR ALL
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "couple: select own assignment"
  ON public.wedding_couples FOR SELECT
  USING (user_id = auth.uid());

-- Now that wedding_couples exists, add couple read policy to weddings
CREATE POLICY "couple: select own wedding"
  ON public.weddings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_couples wc
      WHERE wc.wedding_id = id
        AND wc.user_id = auth.uid()
    )
  );

-- ============================================================
-- ALBUMS
-- visibility: 'private' (admin only) | 'couple' | 'guest'
-- ============================================================
CREATE TABLE public.albums (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  uuid        NOT NULL REFERENCES public.weddings ON DELETE CASCADE,
  title       text        NOT NULL,
  description text        NOT NULL DEFAULT '',
  visibility  text        NOT NULL DEFAULT 'private'
                          CHECK (visibility IN ('private','couple','guest')),
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin: all albums"
  ON public.albums FOR ALL
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "couple: select visible albums"
  ON public.albums FOR SELECT
  USING (
    visibility IN ('couple', 'guest')
    AND EXISTS (
      SELECT 1 FROM public.wedding_couples wc
      WHERE wc.wedding_id = wedding_id
        AND wc.user_id = auth.uid()
    )
  );

-- ============================================================
-- MEDIA_FILES
-- ============================================================
CREATE TABLE public.media_files (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id       uuid        NOT NULL REFERENCES public.weddings ON DELETE CASCADE,
  album_id         uuid        REFERENCES public.albums ON DELETE SET NULL,
  storage_path     text        NOT NULL,
  file_name        text        NOT NULL,
  file_type        text        NOT NULL CHECK (file_type IN ('image','video')),
  mime_type        text        NOT NULL,
  file_size        bigint      NOT NULL,
  width            int,
  height           int,
  duration_seconds int,
  uploaded_by      uuid        REFERENCES public.users ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin: all media"
  ON public.media_files FOR ALL
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "couple: select media in visible albums"
  ON public.media_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.albums a
      JOIN public.wedding_couples wc ON wc.wedding_id = a.wedding_id
      WHERE a.id = album_id
        AND wc.user_id = auth.uid()
        AND a.visibility IN ('couple', 'guest')
    )
  );

-- ============================================================
-- GUEST_TOKENS  (QR access — no Supabase Auth required)
-- album_id NULL  → full wedding guest access
-- album_id set   → single album access
-- ============================================================
CREATE TABLE public.guest_tokens (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  token       text        UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  wedding_id  uuid        NOT NULL REFERENCES public.weddings ON DELETE CASCADE,
  album_id    uuid        REFERENCES public.albums ON DELETE CASCADE,
  label       text        NOT NULL DEFAULT 'Misafirler',
  expires_at  timestamptz,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.guest_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin: all guest_tokens"
  ON public.guest_tokens FOR ALL
  USING (public.get_my_role() = 'admin')
  WITH CHECK (public.get_my_role() = 'admin');

-- ============================================================
-- FAVORITES  (couple accounts only)
-- ============================================================
CREATE TABLE public.favorites (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES public.users ON DELETE CASCADE,
  media_file_id   uuid        NOT NULL REFERENCES public.media_files ON DELETE CASCADE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, media_file_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: manage own favorites"
  ON public.favorites FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('wedding-media', 'wedding-media', false),
  ('covers',        'covers',        true)
ON CONFLICT (id) DO NOTHING;

-- Drop all existing storage.objects policies (safe re-run)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Admin manages all media files
CREATE POLICY "admin: manage wedding-media"
  ON storage.objects FOR ALL
  USING  (bucket_id = 'wedding-media' AND public.get_my_role() = 'admin')
  WITH CHECK (bucket_id = 'wedding-media' AND public.get_my_role() = 'admin');

-- Couple can read media (storage path validation is done server-side)
CREATE POLICY "couple: read wedding-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-media' AND public.get_my_role() = 'couple');

-- Guests can read wedding-media (URL is not guessable without token)
CREATE POLICY "public: read wedding-media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-media');

-- Admin manages covers
CREATE POLICY "admin: manage covers"
  ON storage.objects FOR ALL
  USING  (bucket_id = 'covers' AND public.get_my_role() = 'admin')
  WITH CHECK (bucket_id = 'covers' AND public.get_my_role() = 'admin');

-- Anyone can read public cover images
CREATE POLICY "public: read covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');
