-- =====================================================================
-- PC HUB — Supabase Database Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- ENUM types
-- ---------------------------------------------------------------------
create type user_role as enum ('customer', 'admin');

create type order_status as enum (
  'pending_payment',
  'payment_verification',
  'processing',
  'shipping',
  'delivered',
  'cancelled'
);

create type payment_status as enum ('pending', 'approved', 'rejected');

-- ---------------------------------------------------------------------
-- profiles  (1:1 extension of auth.users)
-- ---------------------------------------------------------------------
create table profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  full_name     text,
  phone         text,
  role          user_role not null default 'customer',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_profiles_role on profiles (role);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------
create table categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text unique,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------
create table products (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid not null references categories (id) on delete restrict,
  name            text not null,
  description     text,
  price           numeric(12, 2) not null check (price >= 0),
  stock_quantity  integer not null default 0 check (stock_quantity >= 0),
  specs           jsonb not null default '{}',       -- e.g. {"socket": "AM5", "cores": "8"}
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_products_category on products (category_id);
create index idx_products_name_trgm on products using gin (name gin_trgm_ops);
create index idx_products_price on products (price);
create index idx_products_active on products (is_active);

create extension if not exists pg_trgm; -- enables fast ILIKE search on name

-- ---------------------------------------------------------------------
-- product_images
-- ---------------------------------------------------------------------
create table product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products (id) on delete cascade,
  image_url     text not null,
  is_primary    boolean not null default false,
  created_at    timestamptz not null default now()
);

create index idx_product_images_product on product_images (product_id);

-- ---------------------------------------------------------------------
-- carts  (one active cart per user)
-- ---------------------------------------------------------------------
create table carts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references profiles (id) on delete cascade,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- cart_items
-- ---------------------------------------------------------------------
create table cart_items (
  id            uuid primary key default gen_random_uuid(),
  cart_id       uuid not null references carts (id) on delete cascade,
  product_id    uuid not null references products (id) on delete cascade,
  quantity      integer not null default 1 check (quantity > 0),
  created_at    timestamptz not null default now(),
  unique (cart_id, product_id)
);

create index idx_cart_items_cart on cart_items (cart_id);

-- ---------------------------------------------------------------------
-- orders
-- ---------------------------------------------------------------------
create table orders (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles (id) on delete restrict,
  status              order_status not null default 'pending_payment',
  shipping_address    jsonb not null,   -- {fullName, phone, address, province, postalCode}
  total_amount        numeric(12, 2) not null check (total_amount >= 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_orders_user on orders (user_id);
create index idx_orders_status on orders (status);
create index idx_orders_created_at on orders (created_at desc);

-- ---------------------------------------------------------------------
-- order_items
-- ---------------------------------------------------------------------
create table order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders (id) on delete cascade,
  product_id    uuid not null references products (id) on delete restrict,
  quantity      integer not null check (quantity > 0),
  unit_price    numeric(12, 2) not null check (unit_price >= 0),
  created_at    timestamptz not null default now()
);

create index idx_order_items_order on order_items (order_id);
create index idx_order_items_product on order_items (product_id);

-- ---------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------
create table payments (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders (id) on delete cascade,
  slip_url      text not null,
  status        payment_status not null default 'pending',
  verified_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index idx_payments_order on payments (order_id);
create index idx_payments_status on payments (status);

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute procedure public.set_updated_at();
create trigger trg_products_updated_at before update on products
  for each row execute procedure public.set_updated_at();
create trigger trg_orders_updated_at before update on orders
  for each row execute procedure public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================

alter table profiles       enable row level security;
alter table categories     enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;
alter table carts          enable row level security;
alter table cart_items     enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;
alter table payments       enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- ---------------- profiles ----------------
create policy "profiles_select_own_or_admin"
  on profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id);

create policy "profiles_admin_manage"
  on profiles for all
  using (public.is_admin());

-- ---------------- categories (public read, admin write) ----------------
create policy "categories_public_read"
  on categories for select
  using (true);

create policy "categories_admin_write"
  on categories for insert with check (public.is_admin());
create policy "categories_admin_update"
  on categories for update using (public.is_admin());
create policy "categories_admin_delete"
  on categories for delete using (public.is_admin());

-- ---------------- products (public read, admin write) ----------------
create policy "products_public_read"
  on products for select
  using (is_active = true or public.is_admin());

create policy "products_admin_write"
  on products for insert with check (public.is_admin());
create policy "products_admin_update"
  on products for update using (public.is_admin());
create policy "products_admin_delete"
  on products for delete using (public.is_admin());

-- ---------------- product_images (public read, admin write) ----------------
create policy "product_images_public_read"
  on product_images for select using (true);
create policy "product_images_admin_write"
  on product_images for insert with check (public.is_admin());
create policy "product_images_admin_delete"
  on product_images for delete using (public.is_admin());

-- ---------------- carts (owner only) ----------------
create policy "carts_owner_all"
  on carts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------- cart_items (owner only, via parent cart) ----------------
create policy "cart_items_owner_all"
  on cart_items for all
  using (exists (select 1 from carts c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from carts c where c.id = cart_id and c.user_id = auth.uid()));

-- ---------------- orders (owner read/insert, admin full) ----------------
create policy "orders_owner_select"
  on orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "orders_owner_insert"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "orders_admin_update"
  on orders for update
  using (public.is_admin());

-- ---------------- order_items (owner read/insert via parent order, admin full) ----------------
create policy "order_items_owner_select"
  on order_items for select
  using (
    exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
  );

create policy "order_items_owner_insert"
  on order_items for insert
  with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- ---------------- payments (owner read/insert via parent order, admin update) ----------------
create policy "payments_owner_select"
  on payments for select
  using (
    exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
  );

create policy "payments_owner_insert"
  on payments for insert
  with check (
    exists (select 1 from orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "payments_admin_update"
  on payments for update
  using (public.is_admin());

-- =====================================================================
-- STORAGE BUCKETS (run once — or create via Dashboard > Storage)
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('payment-slips', 'payment-slips', false)
on conflict (id) do nothing;

-- product-images: public read, admin write
create policy "product_images_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_bucket_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

-- payment-slips: only the uploading customer or an admin can read
create policy "payment_slips_owner_or_admin_read"
  on storage.objects for select
  using (
    bucket_id = 'payment-slips' and
    (owner = auth.uid() or public.is_admin())
  );

create policy "payment_slips_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'payment-slips' and owner = auth.uid());
