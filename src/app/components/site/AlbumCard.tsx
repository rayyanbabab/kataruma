import { Link } from "react-router";
import { Calendar, Camera, Film, ArrowRight } from "lucide-react";
import { useStore, formatDate, countMedia, type Album } from "../../data/store";

export function AlbumCard({ album }: { album: Album }) {
  const { photos, videos } = useStore();
  const c = countMedia(album.id, photos, videos);

  return (
    <Link
      to={`/album/${album.id}`}
      className="group rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={album.cover}
          alt={album.name}
          loading="lazy"
          className="size-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
        />
        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/15" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/70 backdrop-blur-md text-[11px] font-medium text-white/90 border border-white/15 font-mono">
            <Calendar className="size-3 text-amber-300" strokeWidth={1.75} /> {formatDate(album.date)}
          </span>

          <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-slate-950/70 backdrop-blur-md text-[11px] font-medium text-white/90 border border-white/15 font-mono">
            {c.photos > 0 && (
              <span className="flex items-center gap-1">
                <Camera className="size-3 text-white/80" strokeWidth={1.75} /> {c.photos}
              </span>
            )}
            {c.videos > 0 && (
              <span className="flex items-center gap-1">
                <Film className="size-3 text-amber-300" strokeWidth={1.75} /> {c.videos}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-[#0E335C] transition-colors line-clamp-1">
          {album.name}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">
          {album.description || "Dokumentasi kegiatan dan momen kebersamaan warga RW 10."}
        </p>

        {/* Footer info & CTA */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-500 font-mono text-[11px]">
            {c.photos + c.videos} Arsip Media
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#0E335C] group-hover:text-[#C92A2A] transition-colors">
            <span>Buka Album</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </Link>
  );
}
