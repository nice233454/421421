import { SiteData } from '../types';

interface Props {
  data: SiteData;
}

export default function AboutBlock({ data }: Props) {
  return (
    <section id="about" className="bg-stone-950 py-32 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-[3/4] rounded-sm overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Artist"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-amber-400/30" />
          <div className="absolute -top-4 -left-4 w-20 h-20 border border-amber-400/20" />
        </div>

        <div>
          <span className="text-amber-400 text-xs tracking-[0.4em] uppercase font-medium">
            The Story
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-white leading-tight">
            {data.about_title}
          </h2>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-px bg-amber-400" />
            <span className="text-stone-400 text-sm italic">{data.about_subtitle}</span>
          </div>
          <p className="mt-8 text-stone-300 text-lg leading-relaxed">
            {data.about_text}
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[['Albums', '5'], ['Years', '12+'], ['Shows', '300+']].map(([label, val]) => (
              <div key={label} className="border-l border-amber-400/30 pl-4">
                <div className="text-3xl font-black text-white">{val}</div>
                <div className="text-stone-500 text-sm tracking-widest uppercase mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
