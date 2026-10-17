import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Calendar, Image as ImageIcon, Film, Play, Download, ZoomIn, X, FolderOpen, ExternalLink } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { AnimatePresence, motion } from "motion/react";
import { useStore, formatDate, VIDEO_SOURCE_LABEL, ensureAbsoluteUrl, type Video } from "../data/store";
import { Lightbox } from "../components/site/Lightbox";
import { isEmbeddable, toEmbedUrl } from "../components/site/videoUtils";

export function AlbumDetailPage() {
  const { id } = useParams();
  const { albums, photos, videos } = useStore();
  const album = albums.find((a) => a.id === id);
  const albumPhotos = photos.filter((p) => p.albumId === id);
  const albumVideos = videos.filter((v) => v.albumId === id);
  const [tab, setTab] = useState<"foto" | "video">("foto");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [visiblePhotos, setVisiblePhotos] = useState(12);

  if (!album) {
    return (
      <div className="min-h-[70vh] grid place-items-center pt-24 px-4">
        <div className="text-center max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="grid place-items-center size-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
            <FolderOpen className="size-6" />
          </div>
          <h2 className="text-lg font-bold font-heading text-slate-900">Album Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm mt-1">Album mungkin telah dipindahkan atau dihapus oleh pengurus.</p>
          <Link
            to="/#dokumentasi"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E335C] text-white text-xs font-semibold hover:bg-[#1A4D80] transition"
          >
            <ArrowLeft className="size-4" /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const driveUrl = ensureAbsoluteUrl(album.driveLink);

  return (
    <div className="pt-16 bg-slate-50 min-h-screen pb-20">
      {/* Header Hero Banner */}
      <div className="relative h-80 sm:h-96 md:h-[420px] overflow-hidden bg-slate-950">
        <img
          src={album.cover}
          alt={album.name}
          className="size-full object-cover object-center scale-102 blur-[1px]"
        />
        {/* Layered dark gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-10 w-full text-white">
            <Link
              to="/#dokumentasi"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-xs font-medium text-white transition mb-4 shadow-xs"
            >
              <ArrowLeft className="size-3.5" /> Kembali ke Dokumentasi
            </Link>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight text-white leading-tight">
              {album.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <Calendar className="size-3.5 text-amber-300" /> {formatDate(album.date)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <ImageIcon className="size-3.5 text-slate-300" /> {albumPhotos.length} Foto
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <Film className="size-3.5 text-amber-300" /> {albumVideos.length} Video
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading mb-1.5">
                Keterangan Album
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {album.description || "Dokumentasi kegiatan dan momen kebersamaan warga RW 10."}
              </p>
            </div>

            {driveUrl && (
              <a
                href={driveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm shrink-0"
              >
                <FolderOpen className="size-4" />
                <span>Buka Google Drive Lengkap</span>
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mb-8 bg-slate-200/70 p-1 rounded-2xl w-fit border border-slate-300/60">
          <button
            onClick={() => setTab("foto")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === "foto"
                ? "bg-white text-[#0E335C] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="size-4" />
            <span>Koleksi Foto ({albumPhotos.length})</span>
          </button>
          <button
            onClick={() => setTab("video")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === "video"
                ? "bg-white text-[#0E335C] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Film className="size-4" />
            <span>Koleksi Video ({albumVideos.length})</span>
          </button>
        </div>

        {/* Tab: Foto */}
        {tab === "foto" && (
          albumPhotos.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white shadow-sm">
              <ImageIcon className="size-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className="text-slate-600 text-sm font-medium">Belum ada foto yang diunggah ke album ini.</p>
            </div>
          ) : (
            <>
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}>
                <Masonry gutter="20px">
                  {albumPhotos.slice(0, visiblePhotos).map((p, i) => (
                    <div
                      key={p.id}
                      className="relative group rounded-2xl overflow-hidden cursor-pointer bg-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
                      onClick={() => setLightbox(i)}
                    >
                      <img
                        src={p.url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-bold font-heading line-clamp-1">{p.title}</p>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="grid place-items-center size-8 rounded-full bg-slate-950/60 backdrop-blur-md text-white shadow-sm border border-white/20">
                          <ZoomIn className="size-3.5" />
                        </span>
                        <a
                          href={p.url}
                          download
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="grid place-items-center size-8 rounded-full bg-slate-950/60 backdrop-blur-md text-white hover:bg-emerald-600 transition shadow-sm border border-white/20"
                        >
                          <Download className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>

              {visiblePhotos < albumPhotos.length && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisiblePhotos((v) => v + 12)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0E335C] text-white hover:bg-[#1A4D80] transition-all font-semibold text-sm shadow-sm"
                  >
                    Muat Lebih Banyak ({albumPhotos.length - visiblePhotos} lagi)
                  </button>
                </div>
              )}
            </>
          )
        )}

        {/* Tab: Video */}
        {tab === "video" && (
          albumVideos.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 bg-white shadow-sm">
              <Film className="size-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className="text-slate-600 text-sm font-medium">Belum ada video yang diunggah ke album ini.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {albumVideos.map((v) => (
                <div
                  key={v.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <button
                    onClick={() => (isEmbeddable(v) ? setActiveVideo(v) : window.open(v.url, "_blank", "noopener"))}
                    className="relative block w-full aspect-video overflow-hidden bg-slate-950"
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      loading="lazy"
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-slate-950/30 grid place-items-center">
                      <span className="grid place-items-center size-12 rounded-full bg-[#C92A2A] text-white group-hover:scale-110 transition shadow-lg">
                        <Play className="size-5 ml-0.5 fill-current" />
                      </span>
                    </div>
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15">
                      {VIDEO_SOURCE_LABEL[v.source]}
                    </span>
                    {v.duration && (
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-mono">
                        {v.duration}
                      </span>
                    )}
                  </button>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold font-heading text-slate-900 group-hover:text-[#0E335C] transition-colors line-clamp-1">
                        {v.title}
                      </h3>
                      {v.description && (
                        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {v.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{formatDate(v.date)}</span>
                      <button
                        onClick={() => (isEmbeddable(v) ? setActiveVideo(v) : window.open(v.url, "_blank", "noopener"))}
                        className="font-semibold text-[#0E335C] hover:text-[#C92A2A] transition-colors inline-flex items-center gap-1"
                      >
                        <span>Putar Video</span>
                        <Play className="size-3 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <Lightbox photos={albumPhotos} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md grid place-items-center p-4 animate-in fade-in duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
              onClick={() => setActiveVideo(null)}
              aria-label="Tutup"
            >
              <X className="size-7" />
            </button>
            <motion.div
              className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/15"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-black">
                {activeVideo.source === "mp4" ? (
                  <video src={activeVideo.url} controls autoPlay className="size-full" />
                ) : (
                  <iframe src={toEmbedUrl(activeVideo)} title={activeVideo.title} className="size-full" allowFullScreen />
                )}
              </div>
              <div className="p-5 bg-slate-900 border-t border-white/10 text-white">
                <h3 className="text-base sm:text-lg font-bold font-heading">{activeVideo.title}</h3>
                {activeVideo.description && (
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">{activeVideo.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
