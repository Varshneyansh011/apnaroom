
-- Drop the foreign key constraint so reviews can work with static room IDs
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_room_id_fkey;

-- Change room_id from uuid to text to match static data IDs
ALTER TABLE public.reviews ALTER COLUMN room_id TYPE text USING room_id::text;

-- Drop and recreate the trigger function to handle text room_id
CREATE OR REPLACE FUNCTION public.update_room_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _room_id text;
BEGIN
  _room_id := COALESCE(NEW.room_id, OLD.room_id);
  -- Only update if the room exists in the rooms table
  UPDATE public.rooms SET
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE room_id = _room_id), 0),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE room_id = _room_id)
  WHERE id::text = _room_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;
