-- Website clients (sweetdreams.us client portal) share auth.users with the
-- music site. The music profile auto-creator must skip them: they get a
-- public.clients row via the agreement signing flow instead of a music
-- profile, and the trigger's re-raise on profile failure must never be able
-- to abort a website-client account creation.
--
-- This recreates handle_new_user() from 20251201_fix_profile_trigger.sql
-- with the account_type guard as the first statement; everything else is
-- identical. The on_auth_user_created trigger itself is untouched (it
-- already points at this function). Rollback = re-apply the 20251201 body.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
  display_name_value TEXT;
  slug_value TEXT;
  counter INTEGER := 0;
BEGIN
  -- Website clients (client portal accounts) do not get a music profile.
  IF COALESCE(NEW.raw_user_meta_data->>'account_type', '') = 'website_client' THEN
    RETURN NEW;
  END IF;

  -- Get user email from NEW record
  user_email := COALESCE(NEW.email, 'user');

  -- Extract display name from email (part before @)
  -- Fallback to 'user' if email is null
  display_name_value := COALESCE(split_part(user_email, '@', 1), 'user');

  -- Create initial slug from display name (remove non-alphanumeric)
  slug_value := LOWER(REGEXP_REPLACE(display_name_value, '[^a-zA-Z0-9]', '', 'g'));

  -- If slug is empty after cleaning, use 'user'
  IF slug_value = '' THEN
    slug_value := 'user';
  END IF;

  -- Ensure slug is unique by appending counter if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE public_profile_slug = slug_value) LOOP
    counter := counter + 1;
    slug_value := LOWER(REGEXP_REPLACE(display_name_value, '[^a-zA-Z0-9]', '', 'g')) || counter::TEXT;
  END LOOP;

  -- Insert profile for new user
  BEGIN
    INSERT INTO public.profiles (user_id, display_name, public_profile_slug)
    VALUES (NEW.id, display_name_value, slug_value);

    RAISE NOTICE 'Created profile for user % with slug %', NEW.id, slug_value;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but don't block user creation
      RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
      -- Re-raise the exception so Supabase knows it failed
      RAISE;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
