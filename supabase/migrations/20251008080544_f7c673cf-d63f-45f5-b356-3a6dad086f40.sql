-- Add visit_scheduled to the allowed notification types with all existing types
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_type_check 
CHECK (type IN (
  'booking_confirmed',
  'booking_confirmed_host',
  'booking_confirmed_guest',
  'booking_cancelled',
  'booking_created',
  'payment_received',
  'review_created',
  'review_request',
  'property_approved',
  'property_approval',
  'superhost_promotion',
  'visit_scheduled',
  'message_received'
));