import { Reveal, SectionHeading } from "./Reveal";
import { ShieldCheck, HeartHandshake, MapPin, FolderArchive } from "lucide-react";
import { useStore } from "../../data/store";
import { Counter } from "./Counter";

export function About() {
  const { albums, photos, videos, donors } = useStore();
  const totalMedia = photos.length + videos.length;

  return (
    <section id="tentang" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Values */}
          <div className="lg:col-span-7">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Tentang Kataruma RW 10"
                title="Wadah Pemuda Penggerak Kebersamaan & Guyub Rukun Warga"
                desc="Kataruma (Karang Taruna RW 10) adalah inisiatif generasi muda di lingkungan RW 10, Kelurahan Kalibata, Kecamatan Pancoran. Kami berhimpun untuk merawat tali silaturahmi, memajukan lingkungan, dan menyemarakkan kegiatan kemasyarakatan dengan semangat gotong royong."
              />
            </Reveal>

            {/* 3 Core Pillars - Clean, consistent iconography */}
            <div className="space-y-4 mt-6">
              <Reveal delay={0.08}>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all">
                  <div className="grid place-items-center size-10 rounded-xl bg-white border border-slate-200 text-[#0E335C] shrink-0 shadow-2xs">
                    <HeartHandshake className="size-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Guyub Rukun Antargenerasi
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      Menghubungkan tetua warga, pengurus RT/RW, dan anak-anak muda dalam satu ikatan kekeluargaan yang erat dan saling mendukung.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all">
                  <div className="grid place-items-center size-10 rounded-xl bg-white border border-slate-200 text-[#0E335C] shrink-0 shadow-2xs">
                    <FolderArchive className="size-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Arsip Dokumentasi Terbuka
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      Menyimpan dokumentasi foto & video setiap momen perayaan HUT RI dan acara warga agar selalu dapat dikenang dan diakses kapan saja.
                    </p>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all">
                  <div className="grid place-items-center size-10 rounded-xl bg-white border border-slate-200 text-[#0E335C] shrink-0 shadow-2xs">
                    <ShieldCheck className="size-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Amanah & Transparansi Penuh
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      Setiap rupiah sumbangan warga dan donatur dikelola dengan penuh tanggung jawab dan dipublikasikan secara terbuka melalui laporan keuangan.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right Column: Visual Community Stat Card */}
          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="relative rounded-3xl overflow-hidden bg-[#071B33] text-white p-7 sm:p-9 shadow-xl border border-slate-800">
                {/* Header info */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-white/10 p-1.5 flex items-center justify-center">
                      <img src="/logo.png" alt="Logo" className="size-full object-contain" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-300 font-mono">
                        Komunitas Pemuda
                      </p>
                      <p className="text-sm font-bold text-white">RW 10 Kelurahan Kalibata</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/10 text-white/90 border border-white/15 font-mono">
                    Aktif & Guyub
                  </span>
                </div>

                {/* Community Quote */}
                <div className="my-7 py-1">
                  <p className="text-base sm:text-lg italic font-normal text-white/90 leading-relaxed">
                    &ldquo;Kemerdekaan bukan hanya lomba dan panggung sesaat, melainkan ruang mempererat persaudaraan antarwarga.&rdquo;
                  </p>
                  <p className="mt-3 text-xs text-white/60 font-medium">
                    Pesan Kebersamaan Kataruma RW 10
                  </p>
                </div>

                {/* Numbers Grid */}
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      <Counter to={albums.length || 1} />
                    </p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Album Kegiatan</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                      <Counter to={totalMedia || 50} />
                    </p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Foto & Video Arsip</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-heading">
                      <Counter to={donors.length || 10} />
                    </p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Warga & Donatur</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-heading">
                      100%
                    </p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">Terbuka & Transparan</p>
                  </div>
                </div>

                {/* Location indicator */}
                <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
                  <MapPin className="size-3.5 text-amber-400 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">Kalibata Tengah XVI, Pancoran, Jakarta Selatan</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
