
-- Fix trigger to not leak email as display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  RETURN NEW;
END;
$function$;

-- Scrub existing rows where display_name looks like an email
UPDATE public.profiles
SET display_name = 'User'
WHERE display_name LIKE '%@%';
