/*
# Add stream_url column to movies table

## Purpose
Allow admins to add a direct video stream URL (mp4/webm/etc.) alongside or instead of a magnet link.
This lets movies play instantly without needing WebTorrent peers.

## Changes
- New column `stream_url` (text, nullable) on `movies` table.
- No security changes needed — existing RLS policies already cover SELECT/INSERT/UPDATE on all columns.
*/

ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS stream_url text;
