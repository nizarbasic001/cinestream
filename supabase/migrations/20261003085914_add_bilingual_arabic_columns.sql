/*
# Add bilingual Arabic columns to movies table

## Purpose
Store both English and Arabic metadata for movies imported from TMDB.
The existing `title`, `description`, and `genres` columns hold English content.
New columns hold the Arabic equivalents so the UI can switch languages without re-fetching.

## Changes
- `title_ar` (text, nullable) — Arabic movie title
- `description_ar` (text, nullable) — Arabic overview/description
- `genres_ar` (text[], nullable) — Arabic genre names
- `director_ar` (text, nullable) — Arabic director name (if available)
- `cast_ar` (text[], nullable) — Arabic cast member names (if available)

## Notes
- All columns are nullable so existing movies are unaffected.
- No RLS policy changes needed — existing policies already cover all columns.
*/

ALTER TABLE public.movies
  ADD COLUMN IF NOT EXISTS title_ar text,
  ADD COLUMN IF NOT EXISTS description_ar text,
  ADD COLUMN IF NOT EXISTS genres_ar text[],
  ADD COLUMN IF NOT EXISTS director_ar text,
  ADD COLUMN IF NOT EXISTS cast_ar text[];
