import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteData } from '../types';

const defaultData: SiteData = {
  video_url: '',
  video_path: '',
  artist_name: 'ARTIST NAME',
  artist_tagline: 'Singer · Songwriter · Performer',
  about_title: 'About the Artist',
  about_text: 'Born with music in the soul, this artist has spent years crafting a unique sound that blends raw emotion with modern production.',
  about_subtitle: 'A voice that moves generations',
  contact_email: 'booking@artist.com',
  contact_instagram: '@artisthandle',
  contact_spotify: 'spotify.com/artist',
  shows_text: 'New album dropping soon. Follow on social media to stay updated.',
};

export function useSiteContent() {
  const [data, setData] = useState<SiteData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const { data: rows } = await supabase.from('site_content').select('key, value');
      if (rows) {
        const merged = { ...defaultData };
        rows.forEach((row) => {
          if (row.key in merged) {
            (merged as Record<string, string>)[row.key] = row.value;
          }
        });
        setData(merged);
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  return { data, loading };
}
