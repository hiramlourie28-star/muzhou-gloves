-- 询价/联系记录表
create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  source        text not null check (source in ('inquiry', 'contact')),
  name          text not null,
  email         text not null,
  phone         text,
  company       text,
  message       text,
  product_slug  text,
  locale        text,
  extra         jsonb not null default '{}'::jsonb,
  status        text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  notified_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

alter table public.inquiries enable row level security;

-- 任何人（前台访客）可以插入；只有 admin 可以读/改
drop policy if exists inquiries_anon_insert on public.inquiries;
create policy inquiries_anon_insert on public.inquiries
  for insert with check (true);

drop policy if exists inquiries_admin_all on public.inquiries;
create policy inquiries_admin_all on public.inquiries
  for all using (public.is_admin()) with check (public.is_admin());
