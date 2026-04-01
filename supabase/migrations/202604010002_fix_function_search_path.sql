create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.set_post_base_metrics()
returns trigger
language plpgsql
set search_path = public
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
