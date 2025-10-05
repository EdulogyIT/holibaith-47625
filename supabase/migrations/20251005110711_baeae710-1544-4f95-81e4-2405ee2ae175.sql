-- Fix the notify_property_approved function to use correct column names
CREATE OR REPLACE FUNCTION public.notify_property_approved()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  IF NEW.status = 'active' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.notifications (user_id, title, message, type, related_id)
    VALUES (
      NEW.user_id,
      'Property Approved',
      'Your property "' || NEW.title || '" has been approved and is now live!',
      'property_approved',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$function$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_notify_property_approved ON public.properties;

-- Create trigger for property approval notifications
CREATE TRIGGER trigger_notify_property_approved
AFTER UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.notify_property_approved();