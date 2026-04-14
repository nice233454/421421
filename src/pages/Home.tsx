import { useSiteContent } from '../hooks/useSiteContent';
import HeroBlock from '../components/HeroBlock';
import AboutBlock from '../components/AboutBlock';
import ContactBlock from '../components/ContactBlock';

export default function Home() {
  const { data, loading } = useSiteContent();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main>
      <HeroBlock data={data} />
      <AboutBlock data={data} />
      <ContactBlock data={data} />
    </main>
  );
}
