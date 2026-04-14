import { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useSiteContent } from '../hooks/useSiteContent';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../lib/supabase';
import { SiteData } from '../types';

export default function Admin() {
  const { isAuthenticated, login, logout } = useAdmin();
  const { data, loading } = useSiteContent();
  const [liveData, setLiveData] = useState<SiteData | null>(null);

  useEffect(() => {
    if (!loading) setLiveData(data);
  }, [data, loading]);

  async function refreshData() {
    const { data: rows } = await supabase.from('site_content').select('key, value');
    if (rows && liveData) {
      const merged = { ...liveData };
      rows.forEach((row) => {
        if (row.key in merged) {
          (merged as Record<string, string>)[row.key] = row.value;
        }
      });
      setLiveData(merged);
    }
  }

  if (loading || !liveData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <AdminPanel
      data={liveData}
      onLogout={logout}
      onContentUpdate={refreshData}
    />
  );
}
