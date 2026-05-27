-- ============================================================
-- Halawiyat El Djazair — Initial schema
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================
do $$ begin
  create type user_role as enum ('buyer', 'seller', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'preparing', 'ready', 'delivered', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cib', 'edahabia', 'baridimob', 'cod');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payout_status as enum ('pending', 'processing', 'paid', 'failed');
exception when duplicate_object then null; end $$;

-- ============================================================
-- profiles — extends auth.users
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'buyer',
  full_name text not null,
  phone text,
  wilaya_code int check (wilaya_code between 1 and 58),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);

-- ============================================================
-- categories
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_fr text not null,
  icon text,
  sort_order int not null default 0,
  active boolean not null default true,
  commission_rate_bps int check (commission_rate_bps between 0 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists categories_sort_idx on public.categories(sort_order);

-- ============================================================
-- shops
-- ============================================================
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text unique not null,
  name_ar text not null,
  name_fr text not null,
  description text,
  story text,
  logo_url text,
  banner_url text,
  wilaya_code int not null check (wilaya_code between 1 and 58),
  verified boolean not null default false,
  rating_avg numeric(3,2) not null default 0 check (rating_avg between 0 and 5),
  review_count int not null default 0,
  total_sales int not null default 0,
  working_hours text,
  delivery_zones int[] not null default '{}',
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  created_at timestamptz not null default now()
);

create index if not exists shops_owner_idx on public.shops(owner_id);
create index if not exists shops_wilaya_idx on public.shops(wilaya_code);
create index if not exists shops_status_idx on public.shops(status);

-- ============================================================
-- products
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  name_ar text not null,
  name_fr text not null,
  description text,
  price_dzd int not null check (price_dzd >= 0),
  photos text[] not null default '{}',
  stock int not null default 0 check (stock >= 0),
  allergens text[] not null default '{}',
  ingredients text[] not null default '{}',
  prep_time_hours int not null default 0,
  active boolean not null default true,
  featured boolean not null default false,
  rating_avg numeric(3,2) not null default 0,
  review_count int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_shop_idx on public.products(shop_id);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(active) where active;

-- ============================================================
-- orders
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('orders_seq')::text, 4, '0'),
  buyer_id uuid not null references public.profiles(id),
  shop_id uuid not null references public.shops(id),
  items_json jsonb not null,
  subtotal int not null check (subtotal >= 0),
  delivery_fee int not null default 0,
  commission_rate_bps int not null,
  commission_amount int not null,
  total int not null,
  payment_method payment_method not null,
  status order_status not null default 'pending',
  delivery_address text not null,
  delivery_wilaya_code int not null,
  buyer_phone text not null,
  notes text,
  created_at timestamptz not null default now(),
  estimated_delivery timestamptz
);

create sequence if not exists orders_seq start 1;

create index if not exists orders_buyer_idx on public.orders(buyer_id);
create index if not exists orders_shop_idx on public.orders(shop_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- ============================================================
-- reviews
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id),
  shop_id uuid not null references public.shops(id),
  product_id uuid references public.products(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (order_id, product_id)
);

create index if not exists reviews_shop_idx on public.reviews(shop_id);
create index if not exists reviews_product_idx on public.reviews(product_id);

-- ============================================================
-- payouts
-- ============================================================
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  shop_id uuid not null references public.shops(id) on delete cascade,
  gross_amount int not null,
  commission_amount int not null,
  net_amount int not null,
  period_start date not null,
  period_end date not null,
  status payout_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payouts_shop_idx on public.payouts(shop_id);
create index if not exists payouts_status_idx on public.payouts(status);

-- ============================================================
-- disputes
-- ============================================================
create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  order_id uuid not null references public.orders(id),
  opened_by uuid not null references public.profiles(id),
  shop_id uuid not null references public.shops(id),
  reason text not null,
  description text not null,
  amount int not null,
  status text not null default 'open' check (status in ('open','investigating','resolved','refunded','rejected')),
  priority text not null default 'medium' check (priority in ('low','medium','high')),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================================
-- platform_settings — single-row config
-- ============================================================
create table if not exists public.platform_settings (
  id int primary key default 1 check (id = 1),
  default_commission_bps int not null default 1000,
  updated_at timestamptz not null default now()
);
insert into public.platform_settings (id) values (1) on conflict do nothing;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.shops enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reviews enable row level security;
alter table public.payouts enable row level security;
alter table public.disputes enable row level security;
alter table public.categories enable row level security;
alter table public.platform_settings enable row level security;

-- Helper: current user's role
create or replace function public.current_role() returns user_role
language sql stable security definer as $$
  select role from public.profiles where id = auth.uid()
$$;

-- profiles: each user reads/updates own row; admin reads all
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self" on public.profiles for select using (
  auth.uid() = id or public.current_role() = 'admin'
);
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

-- categories: public read, admin write
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories for select using (true);
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories for all using (public.current_role() = 'admin');

-- shops: active/verified visible to all; owner manages; admin everything
drop policy if exists "shops_public_read" on public.shops;
create policy "shops_public_read" on public.shops for select using (
  status = 'active' or owner_id = auth.uid() or public.current_role() = 'admin'
);
drop policy if exists "shops_owner_write" on public.shops;
create policy "shops_owner_write" on public.shops for update using (owner_id = auth.uid());
drop policy if exists "shops_owner_insert" on public.shops;
create policy "shops_owner_insert" on public.shops for insert with check (owner_id = auth.uid());
drop policy if exists "shops_admin_all" on public.shops;
create policy "shops_admin_all" on public.shops for all using (public.current_role() = 'admin');

-- products: active visible to all; shop owner CRUD; admin everything
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (
  active or exists (select 1 from public.shops s where s.id = shop_id and (s.owner_id = auth.uid() or public.current_role() = 'admin'))
);
drop policy if exists "products_owner_write" on public.products;
create policy "products_owner_write" on public.products for all using (
  exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
);

-- orders: buyer reads own, seller reads orders for their shop, admin reads all
drop policy if exists "orders_select" on public.orders;
create policy "orders_select" on public.orders for select using (
  buyer_id = auth.uid()
  or exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
  or public.current_role() = 'admin'
);
drop policy if exists "orders_insert" on public.orders;
create policy "orders_insert" on public.orders for insert with check (buyer_id = auth.uid());
drop policy if exists "orders_update" on public.orders;
create policy "orders_update" on public.orders for update using (
  exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
  or public.current_role() = 'admin'
);

-- reviews: anyone reads; buyer writes for own delivered orders
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews for select using (true);
drop policy if exists "reviews_buyer_insert" on public.reviews;
create policy "reviews_buyer_insert" on public.reviews for insert with check (
  buyer_id = auth.uid()
  and exists (select 1 from public.orders o where o.id = order_id and o.buyer_id = auth.uid() and o.status = 'delivered')
);

-- payouts: shop owner reads own, admin everything
drop policy if exists "payouts_select" on public.payouts;
create policy "payouts_select" on public.payouts for select using (
  exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
  or public.current_role() = 'admin'
);
drop policy if exists "payouts_admin_write" on public.payouts;
create policy "payouts_admin_write" on public.payouts for all using (public.current_role() = 'admin');

-- disputes: parties involved + admin
drop policy if exists "disputes_select" on public.disputes;
create policy "disputes_select" on public.disputes for select using (
  opened_by = auth.uid()
  or exists (select 1 from public.shops s where s.id = shop_id and s.owner_id = auth.uid())
  or public.current_role() = 'admin'
);
drop policy if exists "disputes_buyer_insert" on public.disputes;
create policy "disputes_buyer_insert" on public.disputes for insert with check (opened_by = auth.uid());
drop policy if exists "disputes_admin_write" on public.disputes;
create policy "disputes_admin_write" on public.disputes for update using (public.current_role() = 'admin');

-- platform_settings: anyone reads, admin writes
drop policy if exists "settings_read" on public.platform_settings;
create policy "settings_read" on public.platform_settings for select using (true);
drop policy if exists "settings_admin_write" on public.platform_settings;
create policy "settings_admin_write" on public.platform_settings for update using (public.current_role() = 'admin');

-- ============================================================
-- Triggers — auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Nouvel utilisateur'), 'buyer');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public) values ('product-photos', 'product-photos', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('shop-assets', 'shop-assets', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('seller-docs', 'seller-docs', false) on conflict do nothing;
