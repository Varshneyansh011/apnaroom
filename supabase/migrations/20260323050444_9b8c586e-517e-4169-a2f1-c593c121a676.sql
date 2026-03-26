
-- Reviews table: one review per user per room
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT TO public USING (true);

-- Authenticated users can insert their own review
CREATE POLICY "Users can insert own review" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own review
CREATE POLICY "Users can update own review" ON public.reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own review
CREATE POLICY "Users can delete own review" ON public.reviews
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Function to recalculate room rating when reviews change
CREATE OR REPLACE FUNCTION public.update_room_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _room_id uuid;
BEGIN
  _room_id := COALESCE(NEW.room_id, OLD.room_id);
  UPDATE public.rooms SET
    rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE room_id = _room_id), 0),
    reviews_count = (SELECT COUNT(*) FROM public.reviews WHERE room_id = _room_id)
  WHERE id = _room_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger to auto-update rating
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_room_rating();
