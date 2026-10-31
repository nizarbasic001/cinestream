/*
# Seed Demo Data — Public Domain Movies

## Overview
Inserts demo movie records using public-domain / open-source films from the Blender Foundation
and other open-content creators. These films are freely distributable and their torrents
include WebRTC-compatible trackers so they work with browser-based WebTorrent playback.

## Movies Added
1. Sintel (2010) — Blender Foundation | CC BY 3.0
2. Big Buck Bunny (2008) — Blender Foundation | CC BY 3.0
3. Tears of Steel (2012) — Blender Foundation | CC BY 3.0
4. Elephant's Dream (2006) — Blender Foundation | CC BY 3.0
5. Cosmos Laundromat (2015) — Blender Foundation | CC BY 3.0
6-12. Additional genre-varied placeholder titles for catalog/search testing (no magnet)

## Notes
- Only magnet_link URIs are stored — no movie files.
- Blender torrents include WebRTC tracker URLs for browser compatibility.
- Posters/backdrops use Pexels stock photography as placeholders.
- Idempotent inserts (ON CONFLICT DO NOTHING).
*/

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, imdb_id, tmdb_id, magnet_link, language, featured, published)
VALUES
(
  'Sintel',
  'Sintel',
  'A lonely young woman, Sintel, helps and befriends a dragon she names Scales. When Scales is later kidnapped by an adult dragon, Sintel embarks on a dangerous quest to find her drake friend, embarking on a journey that will change her forever.',
  'https://images.pexels.com/photos/33220012/pexels-photo-33220012.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/14227625/pexels-photo-14227625.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2010-09-27',
  2010,
  7.5,
  14,
  ARRAY['Animation', 'Fantasy', 'Adventure', 'Short'],
  ARRAY['Halina Reijn', 'Thom Hoffman'],
  'Colin Levy',
  'tt1729548',
  45947,
  'magnet:?xt=urn:btih:08ada5a718618e87d35e0f6d8860e97c0f99c2b1&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
  'en',
  true,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, imdb_id, tmdb_id, magnet_link, language, featured, published)
VALUES
(
  'Big Buck Bunny',
  'Big Buck Bunny',
  'A giant rabbit with a heart bigger than himself takes revenge on three rodents who killed his butterfly friends. A heartwarming and humorous animated short from the Blender Institute.',
  'https://images.pexels.com/photos/8528218/pexels-photo-8528218.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/37911514/pexels-photo-37911514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2008-04-10',
  2008,
  7.2,
  10,
  ARRAY['Animation', 'Comedy', 'Family', 'Short'],
  ARRAY[]::text[],
  'Sacha Goedegebure',
  'tt1254209',
  25869,
  'magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062d1b5d1af&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
  'en',
  true,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, imdb_id, tmdb_id, magnet_link, language, featured, published)
VALUES
(
  'Tears of Steel',
  'Tears of Steel',
  'In an apocalyptic future, a group of warriors and scientists gather at the Oude Kerk in Amsterdam to stage a crucial event from the past, in a desperate attempt to rescue the world from destructive robots.',
  'https://images.pexels.com/photos/888781/pexels-photo-888781.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/10002074/pexels-photo-10002074.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2012-09-26',
  2012,
  7.0,
  12,
  ARRAY['Sci-Fi', 'Action', 'Drama', 'Short'],
  ARRAY['Derek de Lint', 'Sergio Hasselbaink', 'Rogier Schippers'],
  'Ian Hubert',
  'tt2298156',
  126002,
  'magnet:?xt=urn:btih:209c8226b299b30882af519decee386e4b1b1a35&dn=Tears+of+Steel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, imdb_id, tmdb_id, magnet_link, language, featured, published)
VALUES
(
  'Elephant''s Dream',
  'Elephant''s Dream',
  'Two strange characters explore a capricious and seemingly infinite machine. The elder, Proog, acts as a guide-protector-teacher, while the younger, Emo, questions and tests the boundaries of this surreal mechanical world.',
  'https://images.pexels.com/photos/34250457/pexels-photo-34250457.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/19313110/pexels-photo-19313110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2006-03-24',
  2006,
  6.8,
  11,
  ARRAY['Animation', 'Sci-Fi', 'Drama', 'Short'],
  ARRAY['Tygo Gernandt', 'Cas Jansen'],
  'Bassam Kurdali',
  'tt0775435',
  74315,
  'magnet:?xt=urn:btih:6a9759bffd5c0af653199750fb1596409ad18f12&dn=Elephants+Dream&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, imdb_id, tmdb_id, magnet_link, language, featured, published)
VALUES
(
  'Cosmos Laundromat',
  'Cosmos Laundromat',
  'On a desolate island, a suicidal sheep named Franck meets an eccentric barber who offers him a chance to change his life. This pilot short showcases the Blender Institute''s ambitious character animation project.',
  'https://images.pexels.com/photos/28133400/pexels-photo-28133400.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/18131771/pexels-photo-18131771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2015-08-09',
  2015,
  7.3,
  12,
  ARRAY['Animation', 'Comedy', 'Sci-Fi', 'Short'],
  ARRAY['Roger Rose', 'Camilla Broomé'],
  'Mathieu Auvray',
  'tt4656290',
  331727,
  'magnet:?xt=urn:btih:c9e15763f722f43e86bd8f4769f7fcf2ba8c9c64&dn=Cosmos+Laundromat&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

-- Additional demo movies with varied genres (no magnet — for catalog/search testing)
INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, magnet_link, language, featured, published)
VALUES
(
  'The Last Frontier',
  'The Last Frontier',
  'A lone explorer ventures into uncharted misty mountains seeking a lost civilization. As nature tests every step, the journey becomes as much internal as external.',
  'https://images.pexels.com/photos/3712574/pexels-photo-3712574.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/38757770/pexels-photo-38757770.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2023-05-15',
  2023,
  8.1,
  118,
  ARRAY['Adventure', 'Drama', 'Thriller'],
  ARRAY[]::text[],
  '',
  '',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, magnet_link, language, featured, published)
VALUES
(
  'Neon Nights',
  'Neon Nights',
  'In a sprawling neon-lit metropolis, a detective hunts a shadowy figure through rain-soaked streets. Every clue leads deeper into a conspiracy that reaches the city''s highest towers.',
  'https://images.pexels.com/photos/22624365/pexels-photo-22624365.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/31233052/pexels-photo-31233052.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2024-01-20',
  2024,
  7.8,
  132,
  ARRAY['Thriller', 'Action', 'Sci-Fi'],
  ARRAY[]::text[],
  '',
  '',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, magnet_link, language, featured, published)
VALUES
(
  'Whispers in the Fog',
  'Whispers in the Fog',
  'A small coastal town is shrouded in an unnatural fog. As residents vanish one by one, a local teacher discovers an ancient secret lurking in the mist.',
  'https://images.pexels.com/photos/14075068/pexels-photo-14075068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/19949819/pexels-photo-19949819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2023-10-31',
  2023,
  6.9,
  95,
  ARRAY['Horror', 'Mystery', 'Thriller'],
  ARRAY[]::text[],
  '',
  '',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, magnet_link, language, featured, published)
VALUES
(
  'Dunes of Time',
  'Dunes of Time',
  'A weary traveler crosses an endless desert, following whispers of an ancient city buried beneath the sands. A meditation on solitude and the passage of time.',
  'https://images.pexels.com/photos/25928640/pexels-photo-25928640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/9094864/pexels-photo-9094864.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2022-07-01',
  2022,
  7.4,
  110,
  ARRAY['Drama', 'Adventure'],
  ARRAY[]::text[],
  '',
  '',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, magnet_link, language, featured, published)
VALUES
(
  'The Stage',
  'The Stage',
  'Behind the curtain of a grand theater, a troupe of actors navigates ambition, heartbreak, and the pursuit of art. A celebration of performance and the human spirit.',
  'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/976862/pexels-photo-976862.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2021-03-12',
  2021,
  8.0,
  125,
  ARRAY['Drama', 'Comedy'],
  ARRAY[]::text[],
  '',
  '',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, magnet_link, language, featured, published)
VALUES
(
  'Starlight Odyssey',
  'Starlight Odyssey',
  'A spacecraft crew awakens from cryosleep to find their ship drifting through an unknown galaxy. As they search for a way home, they encounter wonders beyond imagination.',
  'https://images.pexels.com/photos/5191961/pexels-photo-5191961.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/17505896/pexels-photo-17505896.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2024-06-01',
  2024,
  8.5,
  145,
  ARRAY['Sci-Fi', 'Adventure', 'Drama'],
  ARRAY[]::text[],
  '',
  '',
  'en',
  true,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO movies (title, original_title, description, poster_url, backdrop_url, release_date, year, rating, runtime, genres, cast_members, director, magnet_link, language, featured, published)
VALUES
(
  'Rainy Days',
  'Rainy Days',
  'Two strangers meet during a week of endless rain in a quiet city. What begins as coincidence blossoms into a connection neither expected. A tender story about timing and courage.',
  'https://images.pexels.com/photos/20341320/pexels-photo-20341320.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/34250453/pexels-photo-34250453.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  '2023-02-14',
  2023,
  7.6,
  98,
  ARRAY['Drama', 'Romance', 'Comedy'],
  ARRAY[]::text[],
  '',
  '',
  'en',
  false,
  true
)
ON CONFLICT DO NOTHING;
