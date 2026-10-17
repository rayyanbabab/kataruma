import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, Menu, X, ArrowUpRight, Compass, Home, Info, FolderArchive, Calendar, Images, Video, HeartHandshake, PhoneCall } from "lucide-react";
import { useStore } from "../../data/store";

const LINKS = [
  { label: "Beranda", to: "#beranda", icon: Home },
  { label: "Tentang", to: "#tentang", icon: Info },
  { label: "Dokumentasi", to: "#dokumentasi", icon: FolderArchive },
  { label: "Kalender", to: "#kalender", icon: Calendar },
  { label: "Galeri", to: "#galeri", icon: Images },
  { label: "Video", to: "#video", icon: Video },
  { label: "Donatur", to: "#donatur", icon: HeartHandshake },
  { label: "Kontak", to: "#kontak", icon: PhoneCall },
];

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const { siteSettings } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#beranda");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // detect active section
      const sections = LINKS.map((l) => l.to.replace("#", ""));
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i]);
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveHash("#" + sections[i]);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goHash = (hash: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
      return;
    }
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] py-2.5"
          : "bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Brand identity */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative size-10 sm:size-11 rounded-xl p-1 bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <img
              src="/logo.png"
              alt="Logo Kataruma RW 10"
              className="size-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm sm:text-base font-bold font-heading tracking-tight transition ${
                  scrolled ? "text-[#0E335C]" : "text-white"
                }`}
              >
                {siteSettings.name}
              </span>
              <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#C92A2A]/15 text-[#C92A2A] border border-[#C92A2A]/20">
                RW 10
              </span>
            </div>
            <span
              className={`block text-[11px] sm:text-xs truncate max-w-[200px] sm:max-w-xs transition ${
                scrolled ? "text-slate-500" : "text-white/75"
              }`}
            >
              {siteSettings.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border backdrop-blur-md transition-all ${
            scrolled
              ? "bg-slate-100/80 border-slate-200/80"
              : "bg-white/10 border-white/15 text-white"
          }`}
        >
          {LINKS.map((l) => {
            const isActive = activeHash === l.to;
            return (
              <button
                key={l.to}
                onClick={() => goHash(l.to)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? scrolled
                      ? "bg-[#0E335C] text-white shadow-xs font-semibold"
                      : "bg-white text-[#0E335C] shadow-xs font-semibold"
                    : scrolled
                    ? "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    : "text-white/80 hover:text-white hover:bg-white/15"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </nav>

        {/* Action button: Search & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
              scrolled
                ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                : "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            }`}
            aria-label="Cari dokumentasi"
          >
            <Search className="size-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Cari arsip...</span>
            <kbd
              className={`hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono ${
                scrolled ? "bg-slate-200 text-slate-600" : "bg-black/25 text-white/90"
              }`}
            >
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden grid place-items-center size-9 rounded-xl border transition ${
              scrolled
                ? "border-slate-200 bg-slate-50 text-[#0E335C] hover:bg-slate-100"
                : "border-white/20 bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm"
            }`}
            aria-label="Buka navigasi"
          >
            {mobileOpen ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden mx-4 mt-2 p-3 bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-2 gap-1.5 pb-2 border-b border-slate-100">
            {LINKS.map((l) => {
              const Icon = l.icon;
              const isActive = activeHash === l.to;
              return (
                <button
                  key={l.to}
                  onClick={() => goHash(l.to)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? "bg-[#0E335C] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="size-4 opacity-80 shrink-0" />
                  <span>{l.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2.5 flex items-center justify-between text-xs px-1 text-slate-500">
            <span>Karang Taruna RW 10 Kalibata</span>
            <button
              onClick={() => {
                setMobileOpen(false);
                onSearch();
              }}
              className="flex items-center gap-1 font-semibold text-[#0E335C]"
            >
              <Search className="size-3.5" /> Buka Pencarian
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
