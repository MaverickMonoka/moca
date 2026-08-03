-- =====================================================================
-- MOCA (Mobicom Opportunity & Capital Access) — Supabase schema
-- Run in the Supabase SQL editor, or via `supabase db push`.
-- =====================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- USERS
-- Mirrors auth.users with app-specific profile fields. Row is created by
-- the client on sign-up (see src/hooks/useAuth.ts) and kept in sync via
-- the trigger below as a safety net.
-- ---------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  phone text,
  role text not null default 'entrepreneur' check (role in ('entrepreneur', 'investor', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_role on public.users (role);

-- Keep public.users in sync if a row wasn't created client-side.
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- ---------------------------------------------------------------------
-- BUSINESS PROFILES
-- ---------------------------------------------------------------------
create table if not exists public.business_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  business_name text not null,
  business_type text not null default '',
  sector text not null check (sector in (
    'Agriculture','Technology','Construction','Manufacturing',
    'Tourism','Creative Industries','Youth','Women Owned Businesses'
  )),
  location text not null default '',
  stage text not null default 'Idea' check (stage in ('Idea','Startup','Early Growth','Established','Scaling')),
  funding_requirement numeric(14,2) not null default 0,
  moca_score smallint not null default 0 check (moca_score between 0 and 100),
  registration_number text,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists idx_business_profiles_user on public.business_profiles (user_id);
create index if not exists idx_business_profiles_sector on public.business_profiles (sector);

-- ---------------------------------------------------------------------
-- FUNDING OPPORTUNITIES
-- ---------------------------------------------------------------------
create table if not exists public.funding_opportunities (
  id uuid primary key default uuid_generate_v4(),
  organisation text not null,
  title text not null,
  description text not null default '',
  sector text not null check (sector in (
    'Agriculture','Technology','Construction','Manufacturing',
    'Tourism','Creative Industries','Youth','Women Owned Businesses'
  )),
  amount_min numeric(14,2) not null default 0,
  amount_max numeric(14,2) not null default 0,
  eligibility text not null default '',
  closing_date date not null,
  application_url text,
  logo_url text,
  featured boolean not null default false,
  status text not null default 'open' check (status in ('open', 'closed', 'draft')),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_funding_sector on public.funding_opportunities (sector);
create index if not exists idx_funding_status_closing on public.funding_opportunities (status, closing_date);
create index if not exists idx_funding_featured on public.funding_opportunities (featured) where featured = true;

-- ---------------------------------------------------------------------
-- ARTICLES (MOCA Insights)
-- ---------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  category text not null check (category in (
    'Funding News','Business Growth','AI & Technology','Agriculture','Construction','SMME Advice'
  )),
  cover_image text,
  author text not null default 'MOCA Research Desk',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz not null default now(),
  read_minutes smallint not null default 5,
  created_by uuid references public.users (id) on delete set null
);

create index if not exists idx_articles_category on public.articles (category);
create index if not exists idx_articles_status_published on public.articles (status, published_at desc);

-- ---------------------------------------------------------------------
-- COURSES (Learning Academy)
-- ---------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null default '',
  category text not null default 'Foundations',
  lessons_count smallint not null default 0,
  duration_minutes integer not null default 0,
  level text not null default 'Beginner' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  cover_image text,
  price numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_category on public.courses (category);

-- ---------------------------------------------------------------------
-- APPLICATIONS (user <-> funding_opportunities)
-- ---------------------------------------------------------------------
create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  funding_opportunity_id uuid not null references public.funding_opportunities (id) on delete cascade,
  status text not null default 'draft' check (status in (
    'draft','submitted','under_review','shortlisted','declined','funded'
  )),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, funding_opportunity_id)
);

create index if not exists idx_applications_user on public.applications (user_id);
create index if not exists idx_applications_funding on public.applications (funding_opportunity_id);
create index if not exists idx_applications_status on public.applications (status);

-- ---------------------------------------------------------------------
-- INVESTORS
-- ---------------------------------------------------------------------
create table if not exists public.investors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users (id) on delete set null,
  name text not null,
  organisation text not null,
  focus_sectors text[] not null default '{}',
  ticket_min numeric(14,2) not null default 0,
  ticket_max numeric(14,2) not null default 0,
  bio text not null default '',
  logo_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_investors_user on public.investors (user_id);
create index if not exists idx_investors_sectors on public.investors using gin (focus_sectors);

-- ---------------------------------------------------------------------
-- COMMUNITY POSTS
-- ---------------------------------------------------------------------
create table if not exists public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  body text not null,
  tag text not null default 'General',
  replies_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_community_posts_user on public.community_posts (user_id);
create index if not exists idx_community_posts_created on public.community_posts (created_at desc);

-- ---------------------------------------------------------------------
-- PRODUCTS (Marketplace — entrepreneurs selling products/services)
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users (id) on delete cascade,
  seller_name text not null,
  seller_phone text not null,
  business_name text,
  title text not null,
  description text not null,
  category text not null,
  price numeric(14,2) not null default 0,
  unit text not null default 'per item',
  stock_quantity integer,
  location text not null,
  image_url text,
  status text not null default 'active' check (status in ('active', 'sold_out', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists idx_products_user on public.products (user_id);
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_created on public.products (created_at desc);

-- ---------------------------------------------------------------------
-- NEWSLETTER SUBSCRIBERS
-- ---------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table public.users enable row level security;
alter table public.business_profiles enable row level security;
alter table public.funding_opportunities enable row level security;
alter table public.articles enable row level security;
alter table public.courses enable row level security;
alter table public.applications enable row level security;
alter table public.investors enable row level security;
alter table public.community_posts enable row level security;
alter table public.products enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- USERS: everyone can read basic profile info (for community display),
-- users manage their own row, admins manage all.
create policy "users_select_all" on public.users for select using (true);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_admin_all" on public.users for all using (public.is_admin());

-- BUSINESS PROFILES: owner-only read/write, admins full access.
create policy "business_profiles_owner_select" on public.business_profiles
  for select using (auth.uid() = user_id or public.is_admin());
create policy "business_profiles_owner_insert" on public.business_profiles
  for insert with check (auth.uid() = user_id);
create policy "business_profiles_owner_update" on public.business_profiles
  for update using (auth.uid() = user_id or public.is_admin());
create policy "business_profiles_owner_delete" on public.business_profiles
  for delete using (auth.uid() = user_id or public.is_admin());

-- FUNDING OPPORTUNITIES: public can read open listings, only admins write.
create policy "funding_public_select" on public.funding_opportunities
  for select using (status = 'open' or public.is_admin());
create policy "funding_admin_write" on public.funding_opportunities
  for insert with check (public.is_admin());
create policy "funding_admin_update" on public.funding_opportunities
  for update using (public.is_admin());
create policy "funding_admin_delete" on public.funding_opportunities
  for delete using (public.is_admin());

-- ARTICLES: public can read published, only admins write.
create policy "articles_public_select" on public.articles
  for select using (status = 'published' or public.is_admin());
create policy "articles_admin_write" on public.articles
  for insert with check (public.is_admin());
create policy "articles_admin_update" on public.articles
  for update using (public.is_admin());
create policy "articles_admin_delete" on public.articles
  for delete using (public.is_admin());

-- COURSES: public read, admin write.
create policy "courses_public_select" on public.courses for select using (true);
create policy "courses_admin_write" on public.courses for insert with check (public.is_admin());
create policy "courses_admin_update" on public.courses for update using (public.is_admin());
create policy "courses_admin_delete" on public.courses for delete using (public.is_admin());

-- APPLICATIONS: owner-only, admins full access.
create policy "applications_owner_select" on public.applications
  for select using (auth.uid() = user_id or public.is_admin());
create policy "applications_owner_insert" on public.applications
  for insert with check (auth.uid() = user_id);
create policy "applications_owner_update" on public.applications
  for update using (auth.uid() = user_id or public.is_admin());
create policy "applications_owner_delete" on public.applications
  for delete using (auth.uid() = user_id or public.is_admin());

-- INVESTORS: public read (directory), owner/admin write.
create policy "investors_public_select" on public.investors for select using (true);
create policy "investors_owner_insert" on public.investors
  for insert with check (auth.uid() = user_id or public.is_admin());
create policy "investors_owner_update" on public.investors
  for update using (auth.uid() = user_id or public.is_admin());
create policy "investors_owner_delete" on public.investors
  for delete using (auth.uid() = user_id or public.is_admin());

-- COMMUNITY POSTS: public read, authenticated users post, owner/admin manage.
create policy "community_public_select" on public.community_posts for select using (true);
create policy "community_authenticated_insert" on public.community_posts
  for insert with check (auth.uid() = user_id);
create policy "community_owner_update" on public.community_posts
  for update using (auth.uid() = user_id or public.is_admin());
create policy "community_owner_delete" on public.community_posts
  for delete using (auth.uid() = user_id or public.is_admin());

-- PRODUCTS: public read active listings, authenticated users create, owner/admin manage.
create policy "products_public_select" on public.products
  for select using (status = 'active' or auth.uid() = user_id or public.is_admin());
create policy "products_authenticated_insert" on public.products
  for insert with check (auth.uid() = user_id);
create policy "products_owner_update" on public.products
  for update using (auth.uid() = user_id or public.is_admin());
create policy "products_owner_delete" on public.products
  for delete using (auth.uid() = user_id or public.is_admin());

-- NEWSLETTER: anyone can subscribe (insert), only admins can read the list.
create policy "newsletter_public_insert" on public.newsletter_subscribers
  for insert with check (true);
create policy "newsletter_admin_select" on public.newsletter_subscribers
  for select using (public.is_admin());

-- =====================================================================
-- STORAGE BUCKETS
-- =====================================================================
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('article-covers', 'article-covers', true),
  ('course-media', 'course-media', true),
  ('funding-logos', 'funding-logos', true),
  ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "public_read_avatars" on storage.objects for select using (bucket_id = 'avatars');
create policy "auth_upload_avatars" on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "public_read_article_covers" on storage.objects for select using (bucket_id = 'article-covers');
create policy "admin_upload_article_covers" on storage.objects for insert
  with check (bucket_id = 'article-covers' and public.is_admin());

create policy "public_read_course_media" on storage.objects for select using (bucket_id = 'course-media');
create policy "admin_upload_course_media" on storage.objects for insert
  with check (bucket_id = 'course-media' and public.is_admin());

create policy "public_read_funding_logos" on storage.objects for select using (bucket_id = 'funding-logos');
create policy "admin_upload_funding_logos" on storage.objects for insert
  with check (bucket_id = 'funding-logos' and public.is_admin());

create policy "public_read_product_images" on storage.objects for select using (bucket_id = 'product-images');
create policy "auth_upload_product_images" on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
