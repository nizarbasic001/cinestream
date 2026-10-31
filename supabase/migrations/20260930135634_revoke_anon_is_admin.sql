/*
# Tighten is_admin() execute permissions

Revoke EXECUTE from anon so only authenticated users can call is_admin().
The function is used internally by RLS policies, not directly by the frontend.
*/

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
