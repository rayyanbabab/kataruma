import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, Clock, Calendar, X, ExternalLink, Video as VideoIcon } from "lucide-react";
import { useStore, formatDate, VIDEO_SOURCE_LABEL, type Video } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { isEmbeddable, toEmbedUrl } from "./videoUtils";

export function VideoGallery() {
  const { videos } = useStore();
  const [active, setActive] = useState<Video | null>(null);

  const openVideo = (v: Video) => {
    if (isEmbeddable(v)) setActive(v);
    else window.open(v.url, "_blank", "noopener");
  };

  return (
    <section id="video" className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#0E335C]/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            inverted
            eyebrow="Arsip Video"
            title="Galeri Rekaman Video Kegiatan"
            desc="Saksikan kembali rekaman kemeriahan lomba, sorak penonton, serta pertunjukan panggung kemerdekaan warga RW 10."
          />
        </Reveal>

        {videos.length === 0 && (
          <div className="text-center py-16 px-6 rounded-2xl border border-white/10 bg-white/5 max-w-lg mx-auto">
            <div className="grid place-items-center size-12 rounded-xl bg-white/10 text-slate-400 mx-auto mb-3">
              <VideoIcon className="size-6" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Belum Ada Video Tersimpan</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
              Rekaman video kegiatan warga akan ditambahkan oleh pengurus RW 10.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.08}>
              <div className="group rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full shadow-lg hover:-translate-y-1">
                {/* Video Thumbnail Button */}
                <button
                  onClick={() => openVideo(v)}
                  className="relative block w-full aspect-video overflow-hidden bg-slate-950 text-left"
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    loading="lazy"
                    className="size-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                  {/* Dark vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                  {/* Play Button Trigger */}
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid place-items-center size-12 rounded-full bg-[#C92A2A] text-white group-hover:scale-105 group-hover:bg-[#A61E1E] transition-all duration-200 shadow-md">
                      <Play className="size-5 ml-0.5 fill-current" />
                    </span>
                  </div>

                  {/* Source Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-medium text-white/90 border border-white/15">
                    {VIDEO_SOURCE_LABEL[v.source] || "Video"}
                  </span>

                  {/* Duration Badge */}
                  {v.duration && (
                    <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-medium text-white/90 border border-white/15">
                      <Clock className="size-3 text-amber-300" strokeWidth={1.75} /> {v.duration}
                    </span>
                  )}
                </button>

                {/* Video Info */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold font-heading text-white line-clamp-1 group-hover:text-amber-200 transition-colors">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {v.description || "Video rekaman kegiatan warga RW 10."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                      <Calendar className="size-3 text-slate-400" strokeWidth={1.75} /> {formatDate(v.date)}
                    </span>
                    <button
                      onClick={() => openVideo(v)}
                      className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-amber-200 transition-colors text-xs"
                    >
                      <span>Tonton Video</span>
                      {isEmbeddable(v) ? <Play className="size-3 fill-current" /> : <ExternalLink className="size-3" strokeWidth={1.75} />}
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md grid place-items-center p-4 animate-in fade-in duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
              onClick={() => setActive(null)}
              aria-label="Tutup pemutar"
            >
              <X className="size-7" />
            </button>

            <motion.div
              className="w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/15"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-black">
                {active.source === "mp4" ? (
                  <video src={active.url} controls autoPlay className="size-full" />
                ) : (
                  <iframe
                    src={toEmbedUrl(active)}
                    title={active.title}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="p-5 sm:p-6 bg-slate-900 border-t border-white/10 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300">
                    {VIDEO_SOURCE_LABEL[active.source]}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(active.date)}</span>
                </div>
                <h3 className="text-lg font-bold font-heading">{active.title}</h3>
                {active.description && (
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">{active.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
