import { Link } from "react-router";
import { Flag, Instagram, Phone, Mail, MapPin, Heart, ShieldCheck, ChevronRight } from "lucide-react";
import { useStore } from "../../data/store";

const QUICK = [
  { label: "Beranda", hash: "#beranda" },
  { label: "Tentang Kami", hash: "#tentang" },
  { label: "Dokumentasi Album", hash: "#dokumentasi" },
  { label: "Kalender & Agenda", hash: "#kalender" },
  { label: "Galeri Foto", hash: "#galeri" },
  { label: "Galeri Video", hash: "#video" },
  { label: "Laporan Keuangan", hash: "#laporan-keuangan" },
  { label: "Daftar Donatur", hash: "#donatur" },
  { label: "Kanal Kontak", hash: "#kontak" },
];

export function Footer() {
  const { siteSettings } = useStore();
  const go = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });

  const cleanPhone = siteSettings.whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  const cleanInstagram = siteSettings.instagram.replace(/^@/, "").trim();

  return (
    <footer className="bg-slate-950 text-white pt-16 md:pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl p-1 bg-white ring-1 ring-white/20 shadow-sm flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Logo Kataruma" className="size-full object-contain" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold font-heading text-white">
                    {siteSettings.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#C92A2A] text-white">
                    RW 10
                  </span>
                </div>
                <span className="text-xs text-slate-400">Kalibata, Pancoran, Jakarta Selatan</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Wadah generasi muda RW 10 yang berdedikasi menjaga silaturahmi, merawat gotong royong warga, dan mengabadikan setiap momen kemerdekaan secara transparan.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-medium">
              <ShieldCheck className="size-4" />
              <span>Arsip Digital Resmi & Terbuka untuk Seluruh Warga</span>
            </div>
          </div>

          {/* Quick Links Sitemap */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-heading">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {QUICK.slice(0, 6).map((q) => (
                <li key={q.hash}>
                  <button
                    onClick={() => go(q.hash)}
                    className="text-slate-400 hover:text-white transition flex items-center gap-1.5 group text-left"
                  >
                    <ChevronRight className="size-3 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    <span>{q.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Transparency & Contacts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 font-heading">
              Sekretariat & Hubungan Warga
            </h4>

            <p className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
              <MapPin className="size-4 shrink-0 text-amber-400 mt-0.5" />
              <span>{siteSettings.address}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-emerald-600 transition text-xs font-semibold text-white border border-white/10"
              >
                <Phone className="size-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://instagram.com/${cleanInstagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-rose-600 transition text-xs font-semibold text-white border border-white/10"
              >
                <Instagram className="size-3.5 text-rose-400" />
                <span>Instagram</span>
              </a>
              <a
                href={`mailto:${siteSettings.email}`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-[#0E335C] transition text-xs font-semibold text-white border border-white/10"
              >
                <Mail className="size-3.5 text-blue-400" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {siteSettings.name}. Seluruh hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Dikelola dengan semangat gotong royong warga RW 10</span>
            <Heart className="size-3 text-[#C92A2A] fill-[#C92A2A]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
