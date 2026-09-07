-- التوليف المنظم (JSON) بدل السرد النصي
alter table public.reports add column if not exists synthesis jsonb;
alter table public.reports alter column narrative drop not null;
