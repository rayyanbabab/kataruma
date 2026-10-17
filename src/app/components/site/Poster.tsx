import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore, ensureAbsoluteUrl } from "../../data/store";

/** Section "Poster Informasi" — grid poster aktif, ditaruh di tengah alur halaman. */
export function PosterSection() {
  const { posters } = useStore();
  const active = posters.filter((p) => p.active);
  if (active.length === 0) return null;

  return (
    <section id="poster-informasi" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Papan Pengumuman"
            title="Poster & Selebaran Informasi"
            desc="Informasi resmi, tata tertib, jadwal lomba, dan pengumuman penting seputar lingkungan RW 10."
          />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {active.map((p, i) => {
            const absLink = ensureAbsoluteUrl(p.link);
            const Wrapper = absLink ? "a" : "div";
            return (
              <Reveal key={p.id} delay={i * 0.08}>
                <Wrapper
                  {...(absLink ? { href: absLink, target: "_blank", rel: "noreferrer" } : {})}
                  className="block rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                        <Megaphone className="size-3 text-amber-400" />
                        Pengumuman
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100">
                    <p className="text-sm font-bold font-heading text-slate-900 group-hover:text-[#0E335C] transition-colors line-clamp-1">
                      {p.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {absLink ? "Klik untuk membuka tautan informasi →" : "Informasi resmi warga RW 10"}
                    </p>
                  </div>
                </Wrapper>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Popup poster — muncul otomatis di beranda sebelum pengunjung sempat scroll. */
export function PosterPopup() {
  const { posters } = useStore();
  const [open, setOpen] = useState(false);
  const poster = posters.find((p) => p.active && p.showAsPopup);

  useEffect(() => {
    if (!poster) return;
    const seenKey = `rt02_poster_seen_${poster.id}`;
    if (sessionStorage.getItem(seenKey)) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, [poster?.id]);

  const close = () => {
    setOpen(false);
    if (poster) sessionStorage.setItem(`rt02_poster_seen_${poster.id}`, "1");
  };

  if (!poster || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-3 right-3 grid place-items-center size-8 rounded-full bg-slate-950/60 backdrop-blur-md text-white hover:bg-[#C92A2A] transition z-10 border border-white/20"
          aria-label="Tutup"
        >
          <X className="size-4" />
        </button>

        <div className="overflow-hidden bg-slate-900 max-h-[72vh] flex items-center justify-center">
          {ensureAbsoluteUrl(poster.link) ? (
            <a href={ensureAbsoluteUrl(poster.link)} target="_blank" rel="noreferrer" className="block w-full">
              <img src={poster.imageUrl} alt={poster.title} className="w-full object-contain max-h-[72vh]" />
            </a>
          ) : (
            <img src={poster.imageUrl} alt={poster.title} className="w-full object-contain max-h-[72vh]" />
          )}
        </div>

        <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white border-t border-slate-100">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C92A2A]">Pengumuman Warga</span>
            <p className="text-sm font-bold font-heading text-slate-900 truncate mt-0.5">{poster.title}</p>
          </div>
          {ensureAbsoluteUrl(poster.link) && (
            <a
              href={ensureAbsoluteUrl(poster.link)}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0E335C] text-white text-xs font-semibold hover:bg-[#1A4D80] transition shrink-0"
            >
              Buka Info
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
