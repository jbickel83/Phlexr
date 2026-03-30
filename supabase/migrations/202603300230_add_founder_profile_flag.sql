alter table public.profiles
  add column if not exists is_founder boolean not null default false;

update public.profiles
set
  is_founder = true,
  membership_tier = 'Elite',
  display_name = coalesce(nullif(display_name, ''), 'Josh James'),
  bio = coalesce(nullif(bio, ''), 'building phlexr. mostly cars, watches, and clean spots.'),
  location = coalesce(nullif(location, ''), 'Pittsburgh, PA'),
  avatar_url = coalesce(nullif(avatar_url, ''), '/josh-james-avatar.png')
where username = 'phlexrfounder';

update public.profiles
set
  is_founder = true,
  membership_tier = 'Elite',
  username = coalesce(nullif(username, ''), 'phlexrfounder'),
  display_name = coalesce(nullif(display_name, ''), 'Josh James'),
  bio = coalesce(nullif(bio, ''), 'building phlexr. mostly cars, watches, and clean spots.'),
  location = coalesce(nullif(location, ''), 'Pittsburgh, PA'),
  avatar_url = coalesce(nullif(avatar_url, ''), '/josh-james-avatar.png')
from auth.users
where profiles.id = users.id
  and lower(users.email) = 'phlexrapp@gmail.com';
