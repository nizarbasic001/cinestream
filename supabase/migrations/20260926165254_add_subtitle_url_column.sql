/* Add subtitle_url column to movies table for external subtitle support */
ALTER TABLE movies ADD COLUMN IF NOT EXISTS subtitle_url text;
