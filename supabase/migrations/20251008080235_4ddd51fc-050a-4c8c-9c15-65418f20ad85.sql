-- Add policy to allow system to create visit scheduled notifications
CREATE POLICY "System can create visit scheduled notifications"
ON public.notifications
FOR INSERT
WITH CHECK (type = 'visit_scheduled');