import { FolderOpen, Image as ImageIcon, Film, Users, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useStore, formatDate, countMedia } from "../../data/store";

export function DashboardPage() {
  const { albums, photos, videos, visitors, adminProfile, admin } = useStore();

  const stats = [
    { label: "Total Album", value: albums.length, icon: FolderOpen },
    { label: "Total Foto", value: photos.length, icon: ImageIcon },
    { label: "Total Video", value: videos.length, icon: Film },
    { label: "Total Kunjungan", value: visitors, icon: Users },
  ];

  const seenNames: Record<string, number> = {};
  const chartData = albums.slice(0, 6).map((a) => {
    const c = countMedia(a.id, photos, videos);
    let name = a.name.split(" ").slice(0, 2).join(" ");
    // Pastikan label unik agar recharts tidak mengeluarkan peringatan duplicate key
    if (seenNames[name] !== undefined) {
      seenNames[name] += 1;
      name = `${name} (${seenNames[name]})`;
    } else {
      seenNames[name] = 1;
    }
    return { name, Foto: c.photos, Video: c.videos };
  });

  const adminName = adminProfile?.name || admin?.name || "Admin";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-[#0E335C]" style={{ fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            Ringkasan Dokumentasi
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Selamat bertugas kembali, {adminName}.</p>
        </div>
        <Link
          to="/adminrt02/albums"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C92A2A] text-white hover:bg-[#a71d1d] transition-all shadow-md shadow-red-950/15"
          style={{ fontWeight: 600, fontFamily: "var(--font-heading)" }}
        >
          <Plus className="size-4" /> Tambah Album
        </Link>
      </div>

      {/* stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition">
            <div className="flex items-center justify-between">
              <span className="grid place-items-center size-10 rounded-xl bg-slate-100 border border-slate-200 text-[#0E335C]">
                <s.icon className="size-4.5" />
              </span>
              <TrendingUp className="size-4 text-slate-400" />
            </div>
            <p className="mt-4 text-3xl text-slate-900" style={{ fontWeight: 800, fontFamily: "var(--font-heading)" }}>
              {s.value.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-slate-900 mb-4" style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
            Statistik Media per Kegiatan
          </h3>
          {chartData.length === 0 ? (
            <div className="h-[300px] grid place-items-center text-center text-slate-400 rounded-xl border-2 border-dashed border-slate-200">
              <div>
                <FolderOpen className="size-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Belum ada album. Tambahkan album untuk melihat grafik.</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    fontSize: "13px",
                  }}
                />
                <Bar dataKey="Foto" fill="#0E335C" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Video" fill="#C92A2A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* recent albums */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <h3 className="text-slate-900 mb-4" style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
            Album Terbaru
          </h3>
          <div className="space-y-3">
            {albums.slice(0, 5).map((a) => (
              <Link key={a.id} to="/adminrt02/albums" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200/70">
                <img src={a.cover} alt={a.name} className="size-12 rounded-lg object-cover ring-1 ring-slate-200" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800 truncate" style={{ fontWeight: 600 }}>{a.name}</p>
                  <p className="text-xs text-slate-500">{formatDate(a.date)}</p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${a.status === "publish" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>{a.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
