create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null,
  badge text not null default 'Basic',
  image_url text not null,
  caption text not null default '',
  category text not null default 'Cars',
  score numeric(3, 1) not null default 8.9,
  would_flex_percent integer not null default 82 check (would_flex_percent between 0 and 100),
  fake_ai_percent integer not null default 6 check (fake_ai_percent between 0 and 100),
  boosted boolean not null default false,
  boost_level text,
  boosted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null,
  text text not null,
  report_reason text,
  is_reported boolean not null default false,
  hidden boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_user_id uuid not null references auth.users(id) on delete cascade,
  follower_username text not null,
  following_user_id uuid not null references auth.users(id) on delete cascade,
  following_username text not null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (follower_user_id, following_user_id)
);

create table if not exists public.post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  voter_user_id uuid not null references auth.users(id) on delete cascade,
  vote_type text not null check (vote_type in ('flex', 'notIt', 'fakeAi')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (post_id, voter_user_id)
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_user_id_idx on public.posts (user_id, created_at desc);
create index if not exists comments_post_id_idx on public.comments (post_id, created_at asc);
create index if not exists follows_follower_idx on public.follows (follower_user_id, created_at desc);
create index if not exists follows_following_idx on public.follows (following_user_id, created_at desc);
create index if not exists post_votes_voter_idx on public.post_votes (voter_user_id, created_at desc);

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute procedure public.set_row_updated_at();

alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.post_votes enable row level security;

drop policy if exists "posts_select_authenticated" on public.posts;
create policy "posts_select_authenticated"
  on public.posts
  for select
  to authenticated
  using (true);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
  on public.posts
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
  on public.posts
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
  on public.posts
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "comments_select_authenticated" on public.comments;
create policy "comments_select_authenticated"
  on public.comments
  for select
  to authenticated
  using (true);

drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own"
  on public.comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own"
  on public.comments
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own"
  on public.comments
  for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "follows_select_authenticated" on public.follows;
create policy "follows_select_authenticated"
  on public.follows
  for select
  to authenticated
  using (true);

drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own"
  on public.follows
  for insert
  to authenticated
  with check (auth.uid() = follower_user_id);

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own"
  on public.follows
  for delete
  to authenticated
  using (auth.uid() = follower_user_id);

drop policy if exists "post_votes_select_authenticated" on public.post_votes;
create policy "post_votes_select_authenticated"
  on public.post_votes
  for select
  to authenticated
  using (true);

drop policy if exists "post_votes_insert_own" on public.post_votes;
create policy "post_votes_insert_own"
  on public.post_votes
  for insert
  to authenticated
  with check (auth.uid() = voter_user_id);

drop policy if exists "post_votes_update_own" on public.post_votes;
create policy "post_votes_update_own"
  on public.post_votes
  for update
  to authenticated
  using (auth.uid() = voter_user_id)
  with check (auth.uid() = voter_user_id);

drop policy if exists "post_votes_delete_own" on public.post_votes;
create policy "post_votes_delete_own"
  on public.post_votes
  for delete
  to authenticated
  using (auth.uid() = voter_user_id);

update public.profiles
set
  membership_tier = 'Elite',
  display_name = coalesce(nullif(display_name, ''), 'Josh James'),
  bio = coalesce(nullif(bio, ''), 'building phlexr. mostly cars, watches, and clean spots.'),
  location = coalesce(nullif(location, ''), 'Pittsburgh, PA'),
  avatar_url = coalesce(nullif(avatar_url, ''), '/josh-james-avatar.png')
where username = 'phlexrfounder';

insert into public.posts (
  user_id,
  username,
  display_name,
  badge,
  image_url,
  caption,
  category,
  score,
  would_flex_percent,
  fake_ai_percent,
  boosted,
  boost_level,
  boosted_at,
  created_at
)
select
  profiles.id,
  profiles.username,
  profiles.display_name,
  'Elite',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop',
  'clean enough',
  'Cars',
  9.1,
  85,
  5,
  false,
  null,
  null,
  timezone('utc', now()) - interval '12 minutes'
from public.profiles
where profiles.username = 'phlexrfounder'
  and not exists (
    select 1
    from public.posts
    where posts.user_id = profiles.id
  );
