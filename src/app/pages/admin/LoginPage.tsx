import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { AnimatePresence, motion, motion as m } from "motion/react";
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowLeft, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { useStore, HERO_SLIDES } from "../../data/store";

export function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBgIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (await login(username, password)) {
        toast.success("Berhasil masuk. Selamat datang!");
        navigate("/adminrt02");
      } else {
        setError(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left brand */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden bg-[#071B33]">
        <AnimatePresence mode="sync">
          <motion.img
            key={bgIdx}
            src={HERO_SLIDES[bgIdx].image}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 size-full object-cover opacity-25 mix-blend-overlay"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-[#071B33]/95 via-[#0E335C]/90 to-[#071B33]/98" />
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-[#C92A2A]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 size-80 rounded-full bg-[#D97706]/15 blur-3xl pointer-events-none" />
        
        <Link to="/" className="relative flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition">
          <ArrowLeft className="size-4" /> Kembali ke Beranda
        </Link>
        
        <div className="relative max-w-md">
          <span className="grid place-items-center size-12 rounded-xl bg-white/10 border border-white/15 mb-6 backdrop-blur-sm">
            <ShieldCheck className="size-6 text-white" />
          </span>
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-white/10 text-slate-200 border border-white/20 mb-3 uppercase tracking-wider">
            Sistem Autentikasi Pengurus
          </span>
          <h1 className="text-3xl lg:text-4xl leading-tight" style={{ fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            Portal Admin Dokumentasi
          </h1>
          <p className="mt-3 text-slate-300 text-sm leading-relaxed">
            Kelola arsip foto, video, agenda kegiatan warga, laporan transparansi, dan buku tamu Karang Taruna RW 10 secara terpusat.
          </p>
        </div>
        
        <p className="relative text-xs text-white/40">
          © 2026 Karang Taruna RW 10 Kel. Kalibata. Hak cipta dilindungi.
        </p>
      </div>

      {/* right form */}
      <div className="flex items-center justify-center p-6 bg-[#F8FAFC]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-xl p-8 sm:p-10">
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2 text-[#0E335C] text-sm font-medium hover:underline">
              <ArrowLeft className="size-4" /> Kembali ke Beranda
            </Link>
          </div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 800, fontFamily: "var(--font-heading)" }}>
            {forgot ? "Atur Ulang Sandi" : "Masuk Pengurus"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {forgot ? "Masukkan email yang terdaftar untuk menerima instruksi reset sandi." : "Gunakan akun pengurus Anda untuk melanjutkan."}
          </p>

          {forgot ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Tautan reset password telah dikirim ke email Anda.");
                setForgot(false);
              }}
              className="mt-6 space-y-4"
            >
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
                <input
                  required
                  type="email"
                  placeholder="Email pengurus"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#0E335C] focus:ring-2 focus:ring-[#0E335C]/10 transition"
                />
              </div>
              <button
                className="w-full py-3 rounded-xl bg-[#0E335C] text-white hover:bg-[#071B33] transition shadow-md font-semibold text-sm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Kirim Tautan Reset
              </button>
              <button
                type="button"
                onClick={() => setForgot(false)}
                className="w-full text-xs text-slate-500 hover:text-slate-800 font-medium transition"
              >
                Kembali ke Halaman Masuk
              </button>
            </form>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username / ID Pengurus"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#0E335C] focus:ring-2 focus:ring-[#0E335C]/10 transition"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4.5 text-slate-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type={show ? "text" : "password"}
                  placeholder="Kata Sandi"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#0E335C] focus:ring-2 focus:ring-[#0E335C]/10 transition"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {show ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                </button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-xs">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-[#0E335C] size-4 rounded"
                  />
                  Ingat Sesi Saya
                </label>
                <button
                  type="button"
                  onClick={() => setForgot(true)}
                  className="text-xs text-[#0E335C] hover:text-[#C92A2A] font-medium transition"
                >
                  Lupa Sandi?
                </button>
              </div>
              <button
                disabled={busy}
                className="w-full py-3 rounded-xl bg-[#C92A2A] text-white hover:bg-[#a71d1d] transition shadow-md shadow-red-950/20 disabled:opacity-60 text-sm font-semibold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {busy ? "Memverifikasi..." : "Masuk ke Panel"}
              </button>
              <div className="text-xs text-center text-slate-500 bg-slate-100/70 border border-slate-200/60 rounded-xl py-2.5 px-3">
                <span>Akses Pengurus: Masukkan kredensial akun terdaftar.</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      {/* popup salah sandi */}
      <AnimatePresence>
        {error && (
          <m.div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setError(false)}>
            <m.div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center relative border border-slate-100" initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setError(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
              <span className="grid place-items-center size-12 rounded-xl bg-slate-100 text-[#C92A2A] mx-auto mb-4 border border-slate-200"><AlertTriangle className="size-6" /></span>
              <h3 className="text-lg text-slate-900" style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>Autentikasi Gagal</h3>
              <p className="mt-2 text-sm text-slate-500">Username atau kata sandi yang Anda masukkan tidak sesuai. Periksa kembali dan coba lagi.</p>
              <button onClick={() => { setError(false); setPassword(""); }} className="mt-6 w-full py-2.5 rounded-xl bg-[#C92A2A] text-white hover:bg-[#a71d1d] transition font-semibold text-sm" style={{ fontFamily: "var(--font-heading)" }}>Coba Lagi</button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
