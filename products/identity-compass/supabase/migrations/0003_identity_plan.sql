-- مرحلة البناء ومتابعة الخطة: يكتبهما المستخدم من المتصفح مباشرة تحت أمن الصفوف

create table if not exists public.identities (
  assessment_id uuid primary key references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  doc jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists identities_user_idx on public.identities(user_id);

create table if not exists public.plan_progress (
  assessment_id uuid primary key references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists plan_progress_user_idx on public.plan_progress(user_id);

alter table public.identities enable row level security;
alter table public.plan_progress enable row level security;

drop policy if exists "identities: own" on public.identities;
create policy "identities: own" on public.identities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "plan_progress: own" on public.plan_progress;
create policy "plan_progress: own" on public.plan_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
