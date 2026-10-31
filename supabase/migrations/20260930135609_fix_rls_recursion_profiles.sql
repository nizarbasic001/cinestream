/*
# Fix infinite recursion in RLS policies

## Problem
The `profiles` table SELECT policy checks if a user is admin by querying `profiles` again,
which triggers the same policy recursively → "infinite recursion detected in policy for relation profiles".

This affected:
- profiles_select_own_or_admin (the root cause)
- movies_select_admin_all, movies_insert_admin, movies_update_admin, movies_delete_admin
  (all query profiles to check admin role → also recursive)

## Fix
1. Create a SECURITY DEFINER function `is_admin()` that checks auth.uid() against profiles
   with `SET search_path = ''`. Because SECURITY DEFINER runs as the function owner (postgres),
   it BYPASSES RLS — no recursion.
2. Replace all policies that do `EXISTS (SELECT 1 FROM profiles ...)` with calls to `is_admin()`.
3. Drop and recreate the affected policies on both `profiles` and `movies`.

## Security
- `is_admin()` is SECURITY DEFINER, owned by postgres, search_path locked to empty.
- It only reads `profiles.role` for the calling user's id — no data is exposed beyond a boolean.
- All existing RLS-enabled tables remain enabled.
- No data is modified or lost; only policies are replaced.
*/

-- ============================================================
-- 1. Create the is_admin() helper function (SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================================
-- 2. Fix profiles policies
-- ============================================================
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_insert_own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================
-- 3. Fix movies policies
-- ============================================================
DROP POLICY IF EXISTS "movies_select_admin_all" ON public.movies;
DROP POLICY IF EXISTS "movies_select_published" ON public.movies;
DROP POLICY IF EXISTS "movies_insert_admin" ON public.movies;
DROP POLICY IF EXISTS "movies_update_admin" ON public.movies;
DROP POLICY IF EXISTS "movies_delete_admin" ON public.movies;

CREATE POLICY "movies_select_published"
ON public.movies FOR SELECT
TO anon, authenticated
USING (published = true);

CREATE POLICY "movies_select_admin_all"
ON public.movies FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "movies_insert_admin"
ON public.movies FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "movies_update_admin"
ON public.movies FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "movies_delete_admin"
ON public.movies FOR DELETE
TO authenticated
USING (public.is_admin());
