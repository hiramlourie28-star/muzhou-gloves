-- ============================================================
-- 牧洲手套官网 — 初始 schema
-- products: 商品主表（多语言文案用 jsonb）
-- admins:   后台管理员（绑定 Supabase Auth 用户）
-- 在 Supabase Dashboard → SQL Editor 直接粘贴执行
-- ============================================================

-- ---------- products ----------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  category        text not null check (category in
                    ('ski','leather','fabric','splice','mittens',
                     'animals','fingerless','lace','sports')),
  name            jsonb not null default '{}'::jsonb,        -- {zh,en,es,pt,ru,ja,ko}
  description     jsonb not null default '{}'::jsonb,
  images          text[] not null default '{}',
  price_min       numeric(10,2),
  price_max       numeric(10,2),
  currency        text default 'USD',
  moq             integer,
  material        text,
  size            text,
  lead_days_min   integer,
  lead_days_max   integer,
  features        text[] default '{}',
  featured        boolean not null default false,
  sort_order      integer not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists products_category_idx     on public.products (category);
create index if not exists products_featured_idx     on public.products (featured) where featured = true;
create index if not exists products_active_idx       on public.products (is_active);
create index if not exists products_sort_idx         on public.products (sort_order);

-- updated_at 自动刷新
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- admins ----------
create table if not exists public.admins (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  role        text not null default 'admin' check (role in ('admin','superadmin')),
  created_at  timestamptz not null default now()
);

-- 当前用户是否管理员（RLS 用）
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from public.admins where id = auth.uid())
$$;

-- ---------- RLS ----------
alter table public.products enable row level security;
alter table public.admins   enable row level security;

-- products：所有人可读「上架」商品；管理员可读全部 + 增删改
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (is_active = true);

drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- admins：只有管理员自己能查
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select using (id = auth.uid());

-- ============================================================
-- Storage bucket: product-images（公开读，管理员写）
-- 在 Dashboard → Storage 创建一个名为 product-images 的 bucket，
-- 勾选 Public bucket。然后跑下面的策略：
-- ============================================================
-- 公开读
drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read" on storage.objects
  for select using (bucket_id = 'product-images');

-- 管理员写/改/删
drop policy if exists "product-images admin write" on storage.objects;
create policy "product-images admin write" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product-images admin update" on storage.objects;
create policy "product-images admin update" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product-images admin delete" on storage.objects;
create policy "product-images admin delete" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());
