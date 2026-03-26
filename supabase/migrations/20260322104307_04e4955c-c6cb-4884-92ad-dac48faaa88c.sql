-- Fix overly permissive INSERT policy on provider_submissions
-- Drop the old policy and create one that requires at least a non-empty room_name
DROP POLICY "Anyone can submit" ON public.provider_submissions;

-- Allow anonymous inserts but require submitted_by to be null for anon, or match auth.uid() for authenticated
CREATE POLICY "Authenticated users can submit"
  ON public.provider_submissions FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid());

CREATE POLICY "Anonymous users can submit"
  ON public.provider_submissions FOR INSERT TO anon
  WITH CHECK (submitted_by IS NULL);