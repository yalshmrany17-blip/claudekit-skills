-- مزايا بلس: رسالة العشرة أشخاص، ومراجعة وضوح الهوية

-- روابط التغذية الراجعة (رابط واحد لكل تقييم)
create table if not exists public.feedback_links (
  token text primary key,
  assessment_id uuid not null unique references public.assessments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  summary jsonb,
  created_at timestamptz not null default now()
);
create index if not exists feedback_links_user_idx on public.feedback_links(user_id);

-- ردود الناس (تُكتب من الخادم بمفتاح service role بلا تسجيل دخول)
create table if not exists public.feedback_responses (
  id uuid primary key default gen_random_uuid(),
  token text not null references public.feedback_links(token) on delete cascade,
  relation text,
  keep text not null,
  change text not null,
  best text,
  created_at timestamptz not null default now()
);
create index if not exists feedback_responses_token_idx on public.feedback_responses(token);

-- مراجعة وضوح الهوية (نتيجة الذكاء الاصطناعي) على وثيقة الهوية
alter table public.identities add column if not exists review jsonb;

alter table public.feedback_links enable row level security;
alter table public.feedback_responses enable row level security;

drop policy if exists "feedback_links: own" on public.feedback_links;
create policy "feedback_links: own" on public.feedback_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "feedback_responses: owner reads" on public.feedback_responses;
create policy "feedback_responses: owner reads" on public.feedback_responses
  for select using (exists (select 1 from public.feedback_links l where l.token = token and l.user_id = auth.uid()));
