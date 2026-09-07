-- بوصلة الهوية — المخطط الأولي
-- شغّله في Supabase: SQL Editor أو `supabase db push`

create extension if not exists pgcrypto;

-- ملفات المستخدمين
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz not null default now()
);

-- التقييمات: الإجابات الخام + النتيجة المحسوبة
create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'completed' check (status in ('draft','completed')),
  answers jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists assessments_user_idx on public.assessments(user_id, created_at desc);

-- سرد التقرير المولّد (نسخة واحدة لكل تقييم)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references public.assessments(id) on delete cascade,
  narrative text not null,
  model text,
  created_at timestamptz not null default now()
);

-- المشتريات (تقرير كامل لكل تقييم)
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete set null,
  provider text not null,
  provider_ref text unique,
  amount numeric,
  currency text,
  status text not null default 'paid' check (status in ('paid','refunded','failed')),
  created_at timestamptz not null default now()
);
create index if not exists purchases_user_idx on public.purchases(user_id);
create index if not exists purchases_assessment_idx on public.purchases(assessment_id);

-- أحداث الويبهوك المعالجة (لمنع التكرار)
create table if not exists public.webhook_events (
  id text primary key,
  provider text not null,
  received_at timestamptz not null default now()
);

-- إنشاء الملف تلقائياً عند التسجيل
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', null))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- أمن الصفوف
alter table public.profiles enable row level security;
alter table public.assessments enable row level security;
alter table public.reports enable row level security;
alter table public.purchases enable row level security;
alter table public.webhook_events enable row level security;

drop policy if exists "profiles: own" on public.profiles;
create policy "profiles: own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "assessments: read own" on public.assessments;
create policy "assessments: read own" on public.assessments
  for select using (auth.uid() = user_id);
drop policy if exists "assessments: insert own" on public.assessments;
create policy "assessments: insert own" on public.assessments
  for insert with check (auth.uid() = user_id);

drop policy if exists "reports: read own" on public.reports;
create policy "reports: read own" on public.reports
  for select using (exists (select 1 from public.assessments a where a.id = assessment_id and a.user_id = auth.uid()));

drop policy if exists "purchases: read own" on public.purchases;
create policy "purchases: read own" on public.purchases
  for select using (auth.uid() = user_id);

-- الكتابة في reports و purchases و webhook_events تتم من الخادم بمفتاح service role فقط.
