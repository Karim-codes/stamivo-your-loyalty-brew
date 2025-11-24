-- First, let's check and fix the trigger setup
DROP TRIGGER IF EXISTS on_auth_user_role_assigned ON auth.users;

-- Recreate the trigger with correct name to match the function we created earlier
CREATE TRIGGER on_auth_user_role_assigned
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_role_assignment();

-- Now backfill roles for existing users who don't have roles
-- Check if user owns a business (if yes, they're business user, else customer)
INSERT INTO public.user_roles (user_id, role)
SELECT DISTINCT p.id, 
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.businesses b WHERE b.owner_id = p.id) 
    THEN 'business'::app_role
    ELSE 'customer'::app_role
  END as role
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.id
)
ON CONFLICT (user_id, role) DO NOTHING;