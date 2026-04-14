import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Admin from './pages/Admin';

function getPage(): 'home' | 'admin' {
  return window.location.pathname.startsWith('/admin') ? 'admin' : 'home';
}

export default function App() {
  const [page, setPage] = useState<'home' | 'admin'>(getPage);

  useEffect(() => {
    function onPopState() {
      setPage(getPage());
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (page === 'admin') return <Admin />;
  return <Home />;
}
