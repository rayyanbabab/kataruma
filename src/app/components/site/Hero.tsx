import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Images, Calendar, ShieldCheck, HeartHandshake } from "lucide-react";
import { HERO_SLIDES, useStore } from "../../data/store";

export function Hero() {
  const { albums, photos, videos } = useStore();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 6500);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (hash: string) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="beranda" className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 pt-20">
      {/* Background Slides with smooth subtle transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img
            src={HERO_SLIDES[idx].image}
            alt={HERO_SLIDES[idx].title}
            className="size-full object-cover object-center"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric Multi-layer Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 my-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {/* Clean eyebrow category tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs mb-6 font-mono tracking-wide">
            <span className="font-semibold text-amber-300">Dokumentasi Resmi</span>
            <span className="text-white/40">/</span>
            <span>RW 10 Kalibata</span>
          </div>

          {/* Headline - clean solid typography */}
          <h1 className="text-white text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-[1.14]">
            Merawat Guyub Warga,{" "}
            <span className="text-amber-200">
              Mengabadikan Sejarah RW 10.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal">
            Arsip digital kegiatan warga, peringatan HUT Kemerdekaan RI, serta kegiatan sosial dan kebudayaan yang diselenggarakan oleh warga dan pemuda Kataruma RW 10.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo("#dokumentasi")}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#C92A2A] text-white hover:bg-[#A61E1E] transition-all font-semibold text-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Images className="size-4" strokeWidth={1.75} />
              <span>Lihat Dokumentasi</span>
            </button>

            <button
              onClick={() => scrollTo("#kalender")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-sm transition font-semibold text-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="size-4 text-amber-300" strokeWidth={1.75} />
              <span>Jadwal & Agenda</span>
            </button>

            <button
              onClick={() => scrollTo("#laporan-keuangan")}
              className="text-xs sm:text-sm text-slate-300 hover:text-white transition px-2 py-1 underline-offset-4 hover:underline"
            >
              Transparansi Kas Kegiatan
            </button>
          </div>
        </motion.div>
      </div>

      {/* Slide Navigator & Bottom Info Bar */}
      <div className="relative z-10 w-full border-t border-white/10 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Slide selector items */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1">
            {HERO_SLIDES.map((slide, i) => {
              const isCurrent = i === idx;
              return (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                    isCurrent
                      ? "bg-white/20 text-white font-semibold border border-white/25"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className={isCurrent ? "text-amber-300" : "text-white/40"}>
                    0{i + 1}
                  </span>
                  <span>{slide.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Stats Badges */}
          <div className="hidden sm:flex items-center gap-6 text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <Images className="size-3.5 text-amber-300" strokeWidth={1.75} />
              <span><strong>{albums.length}</strong> Album Terpublikasi</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-400" strokeWidth={1.75} />
              <span>Laporan Kas Terbuka</span>
            </span>
            <span className="flex items-center gap-1.5">
              <HeartHandshake className="size-3.5 text-[#C92A2A]" strokeWidth={1.75} />
              <span>Guyub Rukun RW 10</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
