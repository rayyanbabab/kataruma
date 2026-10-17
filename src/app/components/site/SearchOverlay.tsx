import { AnimatePresence, motion } from "motion/react";
import { Search, X, Mic, Image as ImageIcon, Film, FolderOpen, Clock, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useStore, formatDate } from "../../data/store";

type Filter = "semua" | "album" | "foto" | "video";
type Sort = "terbaru" | "terlama" | "az" | "za";

interface Result {
  id: string;
  type: "album" | "foto" | "video";
  title: string;
  albumName: string;
  date: string;
  thumb: string;
  albumId: string;
}

const POPULAR = ["Panggung Kemerdekaan", "Lomba 17an"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { albums, photos, videos } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [sort, setSort] = useState<Sort>("terbaru");
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  const albumName = (id: string) => albums.find((a) => a.id === id)?.name ?? "-";

  const allResults: Result[] = useMemo(() => {
    const r: Result[] = [];
    albums.forEach((a) =>
      r.push({ id: a.id, type: "album", title: a.name, albumName: a.name, date: a.date, thumb: a.cover, albumId: a.id })
    );
    photos.forEach((p) =>
      r.push({ id: p.id, type: "foto", title: p.title, albumName: albumName(p.albumId), date: p.date, thumb: p.url, albumId: p.albumId })
    );
    videos.forEach((v) =>
      r.push({ id: v.id, type: "video", title: v.title, albumName: albumName(v.albumId), date: v.date, thumb: v.thumbnail, albumId: v.albumId })
    );
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albums, photos, videos]);

  const searchable = (item: Result, text: string) => {
    const q = text.toLowerCase();
    const extra =
      item.type === "foto"
        ? photos.find((p) => p.id === item.id)
        : item.type === "video"
        ? videos.find((v) => v.id === item.id)
        : albums.find((a) => a.id === item.id);
    const blob = [
      item.title || "",
      item.albumName || "",
      (item.date || "").slice(0, 4),
      (extra as any)?.caption ?? "",
      (extra as any)?.description ?? "",
      ((extra as any)?.tags ?? []).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  };

  const results = useMemo(() => {
    let list = allResults;
    if (filter !== "semua") list = list.filter((r) => r.type === filter);
    if (query.trim()) list = list.filter((r) => searchable(r, query.trim()));
    list = [...list].sort((a, b) => {
      if (sort === "terbaru") return b.date.localeCompare(a.date);
      if (sort === "terlama") return a.date.localeCompare(b.date);
      if (sort === "az") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResults, filter, query, sort]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return Array.from(new Set(allResults.map((r) => r.title)))
      .filter((t) => t.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [query, allResults]);

  const runSearch = (term: string) => {
    setQuery(term);
    if (term.trim()) setRecent((p) => [term, ...p.filter((x) => x !== term)].slice(0, 5));
  };

  const go = (r: Result) => {
    onClose();
    navigate(`/album/${r.albumId}`);
  };

  const typeIcon = (t: Result["type"]) =>
    t === "album" ? <FolderOpen className="size-4" /> : t === "foto" ? <ImageIcon className="size-4" /> : <Film className="size-4" />;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white">
              <Search className="size-5 text-[#0E335C]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari foto, video, agenda, atau album dokumentasi..."
                className="flex-1 bg-transparent outline-none text-sm sm:text-base text-slate-900 placeholder:text-slate-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 px-1"
                >
                  Hapus
                </button>
              )}
              <button
                onClick={onClose}
                className="grid place-items-center size-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                aria-label="Tutup"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* filters + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50">
              <div className="flex flex-wrap gap-1.5">
                {(["semua", "album", "foto", "video"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
                      filter === f
                        ? "bg-[#0E335C] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="text-xs bg-white rounded-lg px-2.5 py-1 border border-slate-200 text-slate-700 outline-none shadow-xs font-medium"
              >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="az">Nama A - Z</option>
                <option value="za">Nama Z - A</option>
              </select>
            </div>

            <div className="max-h-[52vh] overflow-y-auto">
              {/* suggestions */}
              {suggestions.length > 0 && (
                <div className="px-5 pt-3.5 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => runSearch(s)}
                      className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* empty state helpers */}
              {!query.trim() && (
                <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-6 bg-white">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">
                      <Clock className="size-3.5" /> Pencarian Terakhir
                    </p>
                    {recent.length === 0 ? (
                      <p className="text-xs text-slate-400">Belum ada riwayat pencarian.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button
                            key={r}
                            onClick={() => setQuery(r)}
                            className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">
                      <TrendingUp className="size-3.5" /> Pencarian Populer
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((r) => (
                        <button
                          key={r}
                          onClick={() => runSearch(r)}
                          className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* results */}
              {query.trim() && results.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-sm">
                  Dokumentasi dengan kata kunci &ldquo;{query}&rdquo; tidak ditemukan.
                </div>
              )}

              {query.trim() &&
                results.map((r) => (
                  <button
                    key={r.type + r.id}
                    onClick={() => go(r)}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition text-left border-b border-slate-100 last:border-b-0"
                  >
                    <img
                      src={r.thumb}
                      alt={r.title}
                      loading="lazy"
                      className="size-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold font-heading text-slate-900 truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{r.albumName}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#0E335C] border border-slate-200 capitalize">
                      {typeIcon(r.type)} {r.type}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:block font-medium">{formatDate(r.date)}</span>
                  </button>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
