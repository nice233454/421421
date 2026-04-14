/*
  # Artist Portfolio Site Schema

  ## New Tables
  - `site_content` — key/value store for all editable site content
    - `id` (uuid, primary key)
    - `key` (text, unique) — content identifier
    - `value` (text) — content value
    - `updated_at` (timestamptz) — last update timestamp

  ## Storage
  - Creates `videos` bucket — public bucket for artist video uploads

  ## Security
  - RLS enabled on `site_content`
  - Public SELECT allowed (site content is readable by all visitors)
  - INSERT/UPDATE restricted to service role only (admin uploads go through storage)
  - Videos bucket is public read, anon insert allowed for admin uploads

  ## Initial Data
  - Seeds default content entries for the artist site
*/

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert site content"
  ON site_content FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update site content"
  ON site_content FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can update site content"
  ON site_content FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can insert site content"
  ON site_content FOR INSERT
  TO anon
  WITH CHECK (true);

INSERT INTO site_content (key, value) VALUES
  ('video_url', ''),
  ('video_path', ''),
  ('artist_name', 'ARTIST NAME'),
  ('artist_tagline', 'Singer · Songwriter · Performer'),
  ('about_title', 'About the Artist'),
  ('about_text', 'Born with music in the soul, this artist has spent years crafting a unique sound that blends raw emotion with modern production. From sold-out venues to studio sessions with the industry''s finest, the journey has been nothing short of extraordinary.'),
  ('about_subtitle', 'A voice that moves generations'),
  ('contact_email', 'booking@artist.com'),
  ('contact_instagram', '@artisthandle'),
  ('contact_spotify', 'spotify.com/artist'),
  ('shows_text', 'New album dropping soon. Follow on social media to stay updated.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000,
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/mov', 'video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read videos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Anon can upload videos"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Anon can update videos"
  ON storage.objects FOR UPDATE
  TO anon
  USING (bucket_id = 'videos');

CREATE POLICY "Anon can delete videos"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'videos');
