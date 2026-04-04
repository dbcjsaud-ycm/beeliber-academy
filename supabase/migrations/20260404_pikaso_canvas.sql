-- ============================================================
-- Pikaso Canvas — DB 마이그레이션
-- 생성: 2026-04-04
-- 테이블: spaces, pages, elements, ai_models, reference_presets,
--         user_references, generations, credit_accounts,
--         credit_transactions, templates, comments
-- ============================================================

-- extensions
create extension if not exists pgcrypto;

-- ── 1. spaces ───────────────────────────────────────────────
create table if not exists public.spaces (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users on delete cascade,
  title         text not null default '새 스페이스',
  settings      jsonb not null default '{}',
  is_public     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists spaces_owner_idx on public.spaces (owner_id);

alter table public.spaces enable row level security;

create policy "spaces: owner full access" on public.spaces
  for all using (auth.uid() = owner_id);

create policy "spaces: public read" on public.spaces
  for select using (is_public = true);

-- ── 2. space_collaborators ──────────────────────────────────
create table if not exists public.space_collaborators (
  id         uuid primary key default gen_random_uuid(),
  space_id   uuid not null references public.spaces on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  role       text not null default 'viewer' check (role in ('viewer', 'editor', 'admin')),
  created_at timestamptz not null default now(),
  unique (space_id, user_id)
);

alter table public.space_collaborators enable row level security;

create policy "space_collaborators: owner can manage" on public.space_collaborators
  for all using (
    exists (
      select 1 from public.spaces s
      where s.id = space_id and s.owner_id = auth.uid()
    )
  );

create policy "space_collaborators: members can read" on public.space_collaborators
  for select using (user_id = auth.uid());

-- ── 3. pages ────────────────────────────────────────────────
create table if not exists public.pages (
  id         uuid primary key default gen_random_uuid(),
  space_id   uuid not null references public.spaces on delete cascade,
  name       text not null default '페이지 1',
  "order"    integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists pages_space_idx on public.pages (space_id);

alter table public.pages enable row level security;

create policy "pages: space owner can manage" on public.pages
  for all using (
    exists (
      select 1 from public.spaces s
      where s.id = space_id and s.owner_id = auth.uid()
    )
  );

create policy "pages: collaborators can read" on public.pages
  for select using (
    exists (
      select 1 from public.space_collaborators sc
      where sc.space_id = space_id and sc.user_id = auth.uid()
    )
  );

-- ── 4. elements ─────────────────────────────────────────────
create table if not exists public.elements (
  id         uuid primary key default gen_random_uuid(),
  page_id    uuid not null references public.pages on delete cascade,
  type       text not null check (type in ('image', 'text', 'video', 'sticky', 'group')),
  x          float8 not null default 0,
  y          float8 not null default 0,
  width      float8 not null default 200,
  height     float8 not null default 200,
  rotation   float8 not null default 0,
  z_index    integer not null default 0,
  data       jsonb not null default '{}',
  group_id   uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists elements_page_idx on public.elements (page_id);

alter table public.elements enable row level security;

create policy "elements: page owner can manage" on public.elements
  for all using (
    exists (
      select 1 from public.pages p
      join public.spaces s on s.id = p.space_id
      where p.id = page_id and s.owner_id = auth.uid()
    )
  );

-- ── 5. ai_models ─────────────────────────────────────────────
create table if not exists public.ai_models (
  id              text primary key,
  name            text not null,
  provider        text not null,
  type            text not null check (type in ('image', 'video', 'audio', '3d')),
  credit_cost_min integer not null default 5,
  credit_cost_max integer not null default 5,
  tags            jsonb not null default '[]',
  estimated_time  text not null default '10s',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table public.ai_models enable row level security;

create policy "ai_models: anyone can read" on public.ai_models
  for select using (true);

-- Seed default models
insert into public.ai_models (id, name, provider, type, credit_cost_min, credit_cost_max, tags, estimated_time)
values
  ('flux-1-fast',        'Flux 1 Fast',       'fal',       'image', 5,   5,   '["fast"]',              '3s'),
  ('flux-2-pro',         'Flux 2 Pro',         'replicate', 'image', 50,  50,  '["quality"]',           '10s'),
  ('seedream-5-lite',    'Seedream 5 Lite',    'fal',       'image', 50,  50,  '["quality","reference"]','12s'),
  ('google-imagen-4',    'Google Imagen 4',    'google',    'image', 100, 100, '["quality","creative"]', '15s'),
  ('gpt',                'GPT Image (DALL-E)', 'openai',    'image', 150, 150, '["quality","creative"]', '20s'),
  ('kling-3',            'Kling 3',            'fal',       'video', 210, 360, '["video"]',             '60s'),
  ('kling-3-omni',       'Kling 3 Omni',       'fal',       'video', 210, 310, '["video"]',             '60s'),
  ('wan-2.2',            'Wan 2.2',            'replicate', 'video', 80,  200, '["video","fast"]',      '30s'),
  ('elevenlabs-v3',      'ElevenLabs v3',      'elevenlabs','audio', 10,  10,  '["audio"]',             '5s'),
  ('elevenlabs-music',   'ElevenLabs Music',   'elevenlabs','audio', 20,  20,  '["audio"]',             '10s')
on conflict (id) do nothing;

-- ── 6. reference_presets ────────────────────────────────────
create table if not exists public.reference_presets (
  id         uuid primary key default gen_random_uuid(),
  category   text not null check (category in ('stock','style','character','element','color','effect','camera')),
  name       text not null,
  thumbnail  text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reference_presets enable row level security;

create policy "reference_presets: anyone can read" on public.reference_presets
  for select using (true);

-- ── 7. user_references ──────────────────────────────────────
create table if not exists public.user_references (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  category   text not null,
  name       text not null,
  image_url  text not null,
  weight     float4 not null default 1.0,
  created_at timestamptz not null default now()
);

create index if not exists user_references_user_idx on public.user_references (user_id);

alter table public.user_references enable row level security;

create policy "user_references: owner full access" on public.user_references
  for all using (auth.uid() = user_id);

-- ── 8. generations ──────────────────────────────────────────
create table if not exists public.generations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  model_id      text not null,
  type          text not null default 'image' check (type in ('image','video','audio','3d','inpaint','outpaint','relight','camera','upscale')),
  status        text not null default 'queued' check (status in ('queued','processing','completed','failed','cancelled')),
  prompt        text,
  output_urls   jsonb not null default '[]',
  credits_cost  integer not null default 0,
  error_message text,
  space_id      uuid references public.spaces on delete set null,
  expires_at    timestamptz not null default (now() + interval '24 hours'),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists generations_user_idx on public.generations (user_id);
create index if not exists generations_status_idx on public.generations (status);
create index if not exists generations_expires_idx on public.generations (expires_at) where status in ('queued','processing');

alter table public.generations enable row level security;

create policy "generations: owner full access" on public.generations
  for all using (auth.uid() = user_id);

-- ── 9. credit_accounts ──────────────────────────────────────
create table if not exists public.credit_accounts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null unique references auth.users on delete cascade,
  balance           integer not null default 500 check (balance >= 0),
  monthly_allowance integer not null default 500,
  used_this_month   integer not null default 0,
  plan              text not null default 'free' check (plan in ('free','pro','enterprise')),
  reset_date        date not null default date_trunc('month', now()) + interval '1 month',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.credit_accounts enable row level security;

create policy "credit_accounts: owner read" on public.credit_accounts
  for select using (auth.uid() = user_id);

-- Atomic deduction function (race-condition safe)
create or replace function public.deduct_credits(
  p_user_id    uuid,
  p_amount     integer,
  p_generation_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  -- Idempotency: skip if this generation already deducted
  if exists (
    select 1 from public.credit_transactions
    where generation_id = p_generation_id and type = 'generation'
  ) then
    return;
  end if;

  -- Atomic balance deduction
  update public.credit_accounts
  set
    balance         = balance - p_amount,
    used_this_month = used_this_month + p_amount,
    updated_at      = now()
  where user_id = p_user_id
    and balance >= p_amount;

  if not found then
    raise exception 'insufficient_credits';
  end if;

  -- Record transaction
  insert into public.credit_transactions (user_id, amount, type, generation_id)
  values (p_user_id, -p_amount, 'generation', p_generation_id);
end;
$$;

-- ── 10. credit_transactions ──────────────────────────────────
create table if not exists public.credit_transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  amount        integer not null,              -- negative = consumed, positive = purchased
  type          text not null check (type in ('generation','purchase','refund','bonus','monthly_reset')),
  model_id      text,
  generation_id uuid unique,                  -- ON CONFLICT (generation_id) DO NOTHING for idempotency
  created_at    timestamptz not null default now()
);

create index if not exists credit_transactions_user_idx on public.credit_transactions (user_id);
create index if not exists credit_transactions_date_idx on public.credit_transactions (created_at);

alter table public.credit_transactions enable row level security;

create policy "credit_transactions: owner read" on public.credit_transactions
  for select using (auth.uid() = user_id);

-- ── 11. templates ────────────────────────────────────────────
create table if not exists public.templates (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  type       text not null check (type in ('image','video','canvas')),
  config     jsonb not null default '{}',
  is_public  boolean not null default false,
  owner_id   uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

alter table public.templates enable row level security;

create policy "templates: public read" on public.templates
  for select using (is_public = true or auth.uid() = owner_id);

-- ── 12. comments ─────────────────────────────────────────────
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  space_id   uuid not null references public.spaces on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  x          float8 not null default 0,
  y          float8 not null default 0,
  content    text not null,
  resolved   boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists comments_space_idx on public.comments (space_id);

alter table public.comments enable row level security;

create policy "comments: space members can read" on public.comments
  for select using (
    exists (
      select 1 from public.spaces s
      where s.id = space_id
        and (s.owner_id = auth.uid() or s.is_public)
    )
  );

create policy "comments: authenticated users can insert" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "comments: owner can update/delete" on public.comments
  for all using (auth.uid() = user_id);

-- ── Auto-provision credit_account on new user signup ─────────
create or replace function public.handle_new_user_credits()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.credit_accounts (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_credits on auth.users;
create trigger on_auth_user_created_credits
  after insert on auth.users
  for each row execute procedure public.handle_new_user_credits();

-- updated_at auto-trigger helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger spaces_updated_at before update on public.spaces
  for each row execute procedure public.set_updated_at();

create trigger elements_updated_at before update on public.elements
  for each row execute procedure public.set_updated_at();

create trigger generations_updated_at before update on public.generations
  for each row execute procedure public.set_updated_at();

create trigger credit_accounts_updated_at before update on public.credit_accounts
  for each row execute procedure public.set_updated_at();
