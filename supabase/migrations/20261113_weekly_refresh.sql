-- Weekly automated refresh from Adorno (scripts/weekly-refresh.mjs).
-- Additive only: existing rows and the live game keep working as before.

-- One row per weekly theme. status: staged -> live -> archived (or skipped).
create table if not exists public.themes (
  id          bigint generated always as identity primary key,
  name        text not null,                 -- shown on the start screen, e.g. "Table Lamps"
  category    text not null unique,          -- value stored in products.category for this week
  adorno_slug text,                          -- Adorno catalog category it was pulled from
  status      text not null default 'staged' check (status in ('staged', 'live', 'archived', 'skipped')),
  cover_image text,                          -- start-screen image
  staged_at   timestamptz not null default now(),
  live_at     timestamptz
);

alter table public.themes enable row level security;
drop policy if exists "Anyone can view the live theme" on public.themes;
create policy "Anyone can view the live theme" on public.themes
  for select using (status = 'live');

alter table public.products
  add column if not exists theme_id      bigint references public.themes(id),
  add column if not exists review_status text check (review_status in ('pending', 'approved', 'rejected')),
  add column if not exists image_crops   jsonb,   -- per photo, per frame crop/fit (see crop.js)
  add column if not exists crop_warnings jsonb,   -- auto-crop notes shown on the review page
  add column if not exists source        text,    -- 'adorno' for automated rows
  add column if not exists source_id     bigint;  -- Adorno product id, for de-duplication

alter table public.products alter column created_at set default now();

create unique index if not exists products_source_unique on public.products (source, source_id) where source_id is not null;
create index if not exists products_theme_idx on public.products (theme_id);

-- Record the theme that's live today so the first automated publish retires it cleanly.
insert into public.themes (name, category, status, cover_image, live_at)
select 'Storage', 'Storage', 'live',
       'https://media.adorno.design/wp-content/uploads/2023/05/08092543/mantas-mantas_2304_034-800x1199.webp', now()
where not exists (select 1 from public.themes where category = 'Storage');

update public.products p
   set theme_id = t.id, review_status = 'approved'
  from public.themes t
 where t.category = 'Storage'
   and p.category @> array['"Storage"'::jsonb]
   and p.theme_id is null;
