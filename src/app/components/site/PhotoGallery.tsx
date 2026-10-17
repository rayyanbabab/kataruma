import { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ZoomIn, Download, Images } from "lucide-react";
import { useStore } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { Lightbox } from "./Lightbox";

export function PhotoGallery() {
  const { photos } = useStore();
  const [visible, setVisible] = useState(9);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const shown = photos.slice(0, visible);

  return (
    <section id="galeri" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Galeri Foto Pilihan"
            title="Sorotan Momen & Potret Warga"
            desc="Kumpulan potret tawa, perjuangan lomba, dan kehangatan seluruh warga RW 10 dalam berbagai kegiatan."
          />
        </Reveal>

        {photos.length === 0 && (
          <div className="text-center py-16 px-6 rounded-2xl border border-slate-200 bg-white shadow-2xs max-w-lg mx-auto">
            <div className="grid place-items-center size-12 rounded-xl bg-slate-100 text-slate-500 mx-auto mb-3">
              <Images className="size-6" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Galeri Belum Terisi</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
              Foto-foto dokumentasi kegiatan warga akan diunggah oleh pengurus RW 10.
            </p>
          </div>
        )}

        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}>
          <Masonry gutter="20px">
            {shown.map((p) => {
              const realIndex = photos.findIndex((x) => x.id === p.id);
              return (
                <div
                  key={p.id}
                  className="relative group rounded-2xl overflow-hidden cursor-pointer bg-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300"
                  onClick={() => setLightbox(realIndex)}
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    loading="lazy"
                    className="w-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <p className="text-white text-sm sm:text-base font-bold font-heading line-clamp-1">
                      {p.title}
                    </p>
                    {p.caption && (
                      <p className="text-slate-300 text-xs line-clamp-2 mt-1 leading-relaxed">
                        {p.caption}
                      </p>
                    )}
                  </div>

                  {/* Top-right Action Buttons */}
                  <div className="absolute top-3.5 right-3.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="grid place-items-center size-8 rounded-lg bg-slate-950/70 backdrop-blur-md text-white hover:bg-[#0E335C] transition shadow-xs border border-white/20"
                      title="Perbesar foto"
                    >
                      <ZoomIn className="size-3.5" strokeWidth={1.75} />
                    </button>
                    <a
                      href={p.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="grid place-items-center size-8 rounded-lg bg-slate-950/70 backdrop-blur-md text-white hover:bg-emerald-600 transition shadow-xs border border-white/20"
                      title="Unduh foto asli"
                    >
                      <Download className="size-3.5" strokeWidth={1.75} />
                    </a>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>

        {visible < photos.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisible((v) => v + 9)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0E335C] hover:bg-[#1A4D80] text-white transition-all shadow-xs font-semibold text-sm hover:-translate-y-0.5"
            >
              <Images className="size-4" strokeWidth={1.75} />
              <span>Muat Foto Lainnya ({photos.length - visible} Tersisa)</span>
            </button>
          </div>
        )}
      </div>

      <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </section>
  );
}
