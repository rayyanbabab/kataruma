import { useState } from "react";
import { LayoutGrid, List, Search, FolderArchive, ArrowRight, Calendar, Camera, Film } from "lucide-react";
import { useStore, formatDate, countMedia } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { AlbumCard } from "./AlbumCard";
import { Link } from "react-router";

export function Documentation({ onSearch }: { onSearch: () => void }) {
  const { albums, photos, videos } = useStore();
  const published = albums.filter((a) => a.status === "publish");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section id="dokumentasi" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Arsip Dokumentasi"
            title="Album Kegiatan Warga & HUT RI"
            desc="Kumpulan rekam jejak kegiatan peringatan kemerdekaan, kerja bakti, dan kebersamaan warga RW 10 yang diabadikan oleh pemuda Kataruma."
          />
        </Reveal>

        {/* Toolbar: Search Trigger & View Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={onSearch}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-900 transition-all text-sm shadow-2xs group w-full sm:w-auto sm:min-w-[320px] text-left"
          >
            <Search className="size-4 text-slate-400 group-hover:text-[#0E335C] transition-colors" strokeWidth={1.75} />
            <span className="flex-1 text-slate-500 text-xs sm:text-sm">Cari album, foto, atau tahun...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-500 border border-slate-200">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-slate-500 font-mono">
              {published.length} Album Terpublikasi
            </span>

            <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  view === "grid"
                    ? "bg-[#0E335C] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="Tampilan Grid"
              >
                <LayoutGrid className="size-4" strokeWidth={1.75} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  view === "list"
                    ? "bg-[#0E335C] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="Tampilan List"
              >
                <List className="size-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Display */}
        {published.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl border border-slate-200 bg-white shadow-2xs max-w-lg mx-auto">
            <div className="grid place-items-center size-12 rounded-xl bg-slate-100 text-slate-500 mx-auto mb-3">
              <FolderArchive className="size-6" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Belum Ada Album Dokumentasi</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
              Dokumentasi foto dan video kegiatan warga sedang disiapkan oleh pengurus RW 10.
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {published.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 0.08}>
                <AlbumCard album={a} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {published.map((a) => {
              const c = countMedia(a.id, photos, videos);
              return (
                <Link
                  key={a.id}
                  to={`/album/${a.id}`}
                  className="flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-md hover:border-[#0E335C]/30 transition group items-start sm:items-center"
                >
                  <div className="relative size-full sm:size-32 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={a.cover}
                      alt={a.name}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 font-mono">
                        <Calendar className="size-3 text-amber-600" strokeWidth={1.75} /> {formatDate(a.date)}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-[#0E335C] transition-colors">
                      {a.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {a.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Camera className="size-3.5 text-slate-400" strokeWidth={1.75} /> {c.photos} Foto
                      </span>
                      <span className="flex items-center gap-1">
                        <Film className="size-3.5 text-slate-400" strokeWidth={1.75} /> {c.videos} Video
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#0E335C] group-hover:text-[#C92A2A] transition-colors shrink-0 px-3">
                    <span>Lihat Album</span>
                    <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
