import { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SiteData } from '../types';

interface Props {
  data: SiteData;
}

export default function HeroBlock({ data }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [data.video_url]);

  function scrollToAbout() {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {data.video_url ? (
        <video
          ref={videoRef}
          src={data.video_url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55)' }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-stone-900 to-black" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        <div className="mb-4 tracking-[0.4em] text-amber-400 text-xs font-medium uppercase">
          Official
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none mb-4">
          {data.artist_name}
        </h1>
        <p className="text-lg md:text-xl text-stone-300 tracking-[0.2em] font-light">
          {data.artist_tagline}
        </p>
        <div className="mt-10 flex gap-1">
          <div className="w-8 h-px bg-amber-400" />
          <div className="w-2 h-px bg-amber-400/50" />
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-amber-400 transition-colors duration-300 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}
