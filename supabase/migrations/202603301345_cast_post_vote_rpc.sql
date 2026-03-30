create or replace function public.cast_post_vote(target_post_id uuid, next_vote_type text)
returns table (
  id uuid,
  user_id uuid,
  username text,
  display_name text,
  badge text,
  image_url text,
  caption text,
  category text,
  score numeric,
  would_flex_percent integer,
  fake_ai_percent integer,
  boosted boolean,
  boost_level text,
  boosted_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  authenticated_user_id uuid := auth.uid();
begin
  if authenticated_user_id is null then
    raise exception 'Authentication required';
  end if;

  if next_vote_type not in ('flex', 'notIt', 'fakeAi') then
    raise exception 'Invalid vote type';
  end if;

  if not exists (
    select 1
    from public.posts
    where posts.id = target_post_id
  ) then
    raise exception 'Post not found';
  end if;

  insert into public.post_votes (post_id, voter_user_id, vote_type)
  values (target_post_id, authenticated_user_id, next_vote_type)
  on conflict (post_id, voter_user_id)
  do update set vote_type = excluded.vote_type;

  perform public.recalculate_post_vote_totals(target_post_id);

  return query
  select
    posts.id,
    posts.user_id,
    posts.username,
    posts.display_name,
    posts.badge,
    posts.image_url,
    posts.caption,
    posts.category,
    posts.score,
    posts.would_flex_percent,
    posts.fake_ai_percent,
    posts.boosted,
    posts.boost_level,
    posts.boosted_at,
    posts.created_at
  from public.posts
  where posts.id = target_post_id;
end;
$$;

grant execute on function public.cast_post_vote(uuid, text) to authenticated;
