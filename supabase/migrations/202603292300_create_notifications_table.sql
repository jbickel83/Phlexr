create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_username text,
  actor_display_name text,
  type text not null check (type in ('follow', 'comment', 'vote', 'boost')),
  post_id text,
  comment_id text,
  read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists notifications_recipient_created_at_idx
  on public.notifications (recipient_user_id, created_at desc);

create index if not exists notifications_recipient_read_idx
  on public.notifications (recipient_user_id, read, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications
  for select
  using (auth.uid() = recipient_user_id);

drop policy if exists "notifications_insert_actor_or_recipient" on public.notifications;
create policy "notifications_insert_actor_or_recipient"
  on public.notifications
  for insert
  with check (
    auth.uid() = recipient_user_id
    or auth.uid() = actor_user_id
  );

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
  on public.notifications
  for update
  using (auth.uid() = recipient_user_id)
  with check (auth.uid() = recipient_user_id);
