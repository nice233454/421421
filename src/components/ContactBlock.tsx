import { Mail, Instagram, Music, ArrowRight } from 'lucide-react';
import { SiteData } from '../types';

interface Props {
  data: SiteData;
}

export default function ContactBlock({ data }: Props) {
  return (
    <section id="contact" className="bg-black py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute border border-amber-400 rounded-full"
            style={{
              width: `${200 + i * 150}px`,
              height: `${200 + i * 150}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="text-amber-400 text-xs tracking-[0.4em] uppercase font-medium">
          Connect
        </span>
        <h2 className="mt-4 text-4xl md:text-6xl font-black text-white leading-tight">
          Stay in Touch
        </h2>
        <p className="mt-6 text-stone-400 text-lg max-w-xl mx-auto leading-relaxed">
          {data.shows_text}
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <a
            href={`mailto:${data.contact_email}`}
            className="group bg-stone-950 border border-stone-800 hover:border-amber-400/50 rounded-sm p-8 transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-amber-400/10 group-hover:bg-amber-400/20 flex items-center justify-center transition-colors duration-300">
              <Mail className="text-amber-400" size={20} />
            </div>
            <div>
              <div className="text-stone-500 text-xs tracking-widest uppercase mb-1">Email</div>
              <div className="text-white text-sm font-medium">{data.contact_email}</div>
            </div>
            <ArrowRight size={16} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href={`https://instagram.com/${data.contact_instagram.replace('@', '')}`}
            target="_blank"
            rel="noreferrer"
            className="group bg-stone-950 border border-stone-800 hover:border-amber-400/50 rounded-sm p-8 transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-amber-400/10 group-hover:bg-amber-400/20 flex items-center justify-center transition-colors duration-300">
              <Instagram className="text-amber-400" size={20} />
            </div>
            <div>
              <div className="text-stone-500 text-xs tracking-widest uppercase mb-1">Instagram</div>
              <div className="text-white text-sm font-medium">{data.contact_instagram}</div>
            </div>
            <ArrowRight size={16} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href={`https://${data.contact_spotify}`}
            target="_blank"
            rel="noreferrer"
            className="group bg-stone-950 border border-stone-800 hover:border-amber-400/50 rounded-sm p-8 transition-all duration-300 flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-amber-400/10 group-hover:bg-amber-400/20 flex items-center justify-center transition-colors duration-300">
              <Music className="text-amber-400" size={20} />
            </div>
            <div>
              <div className="text-stone-500 text-xs tracking-widest uppercase mb-1">Spotify</div>
              <div className="text-white text-sm font-medium">Listen Now</div>
            </div>
            <ArrowRight size={16} className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        <div className="mt-20 pt-8 border-t border-stone-900 text-stone-600 text-sm">
          © {new Date().getFullYear()} {data.artist_name}. All rights reserved.
        </div>
      </div>
    </section>
  );
}
