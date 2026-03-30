alter table public.posts
  add column if not exists base_score numeric(3, 1),
  add column if not exists base_would_flex_percent integer,
  add column if not exists base_fake_ai_percent integer;

update public.posts
set
  base_score = coalesce(base_score, score),
  base_would_flex_percent = coalesce(base_would_flex_percent, would_flex_percent),
  base_fake_ai_percent = coalesce(base_fake_ai_percent, fake_ai_percent)
where
  base_score is null
  or base_would_flex_percent is null
  or base_fake_ai_percent is null;

create or replace function public.set_post_base_metrics()
returns trigger
language plpgsql
as $$
begin
  if new.base_score is null then
    new.base_score = new.score;
  end if;

  if new.base_would_flex_percent is null then
    new.base_would_flex_percent = new.would_flex_percent;
  end if;

  if new.base_fake_ai_percent is null then
    new.base_fake_ai_percent = new.fake_ai_percent;
  end if;

  return new;
end;
$$;

drop trigger if exists posts_set_base_metrics on public.posts;
create trigger posts_set_base_metrics
  before insert on public.posts
  for each row execute procedure public.set_post_base_metrics();

create or replace function public.recalculate_post_vote_totals(target_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  flex_count integer := 0;
  not_it_count integer := 0;
  fake_ai_count integer := 0;
begin
  select
    count(*) filter (where vote_type = 'flex'),
    count(*) filter (where vote_type = 'notIt'),
    count(*) filter (where vote_type = 'fakeAi')
  into flex_count, not_it_count, fake_ai_count
  from public.post_votes
  where post_id = target_post_id;

  update public.posts
  set
    score = greatest(
      5.5,
      least(
        10.0,
        round(
          (
            coalesce(base_score, score)
            + (flex_count * 0.12)
            + (not_it_count * -0.18)
            + (fake_ai_count * -0.26)
          )::numeric,
          1
        )
      )
    ),
    would_flex_percent = greatest(
      35,
      least(
        99,
        round(
          coalesce(base_would_flex_percent, would_flex_percent)
          + (flex_count * 3)
          + (not_it_count * -4)
          + (fake_ai_count * -6)
        )
      )
    ),
    fake_ai_percent = greatest(
      1,
      least(
        60,
        round(
          coalesce(base_fake_ai_percent, fake_ai_percent)
          + (flex_count * -1)
          + (not_it_count * 1)
          + (fake_ai_count * 4)
        )
      )
    )
  where id = target_post_id;
end;
$$;

create or replace function public.sync_post_vote_totals()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalculate_post_vote_totals(old.post_id);
    return old;
  end if;

  perform public.recalculate_post_vote_totals(new.post_id);

  if tg_op = 'UPDATE' and old.post_id is distinct from new.post_id then
    perform public.recalculate_post_vote_totals(old.post_id);
  end if;

  return new;
end;
$$;

drop trigger if exists post_votes_sync_post_totals on public.post_votes;
create trigger post_votes_sync_post_totals
  after insert or update or delete on public.post_votes
  for each row execute procedure public.sync_post_vote_totals();
