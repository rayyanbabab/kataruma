import { useState } from "react";
import { MapPin, Phone, Instagram, Mail, ExternalLink, Copy, Check, MessageSquare } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore } from "../../data/store";
import { toast } from "sonner";

export function Contact() {
  const { siteSettings } = useStore();
  const [copied, setCopied] = useState(false);

  const cleanPhone = siteSettings.whatsapp.replace(/\D/g, "").replace(/^0/, "62");
  const cleanInstagram = siteSettings.instagram.replace(/^@/, "").trim();

  const copyAddress = () => {
    navigator.clipboard.writeText(siteSettings.address);
    setCopied(true);
    toast.success("Alamat sekretariat disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const CONTACTS = [
    {
      icon: Phone,
      label: "WhatsApp Panitia",
      value: siteSettings.whatsapp,
      desc: "Layanan cepat konfirmasi kegiatan & donasi",
      href: `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Halo Pengurus Kataruma RW 10, saya ingin bertanya tentang kegiatan...")}`,
      btnText: "Kirim Pesan WhatsApp",
    },
    {
      icon: Instagram,
      label: "Instagram Resmi",
      value: siteSettings.instagram,
      desc: "Ikuti dokumentasi cerita & pengumuman harian",
      href: `https://instagram.com/${cleanInstagram}`,
      btnText: "Buka Profil Instagram",
    },
    {
      icon: Mail,
      label: "Email Sekretariat",
      value: siteSettings.email,
      desc: "Surat menyurat resmi & kemitraan kegiatan",
      href: `mailto:${siteSettings.email}`,
      btnText: "Kirim Email Resmi",
    },
  ];

  return (
    <section id="kontak" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Kanal Komunikasi"
            title="Sekretariat & Hubungi Panitia"
            desc="Pintu silaturahmi selalu terbuka bagi seluruh warga RW 10, donatur, maupun pihak yang ingin bekerja sama."
          />
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column: Sekretariat & Direct Links */}
          <div className="lg:col-span-5 space-y-3.5 flex flex-col justify-between">
            <Reveal>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <div className="flex items-start gap-3.5">
                  <div className="grid place-items-center size-10 rounded-xl bg-[#0E335C] text-white shrink-0 shadow-2xs">
                    <MapPin className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold font-heading text-slate-900">
                        {siteSettings.name}
                      </h3>
                      <button
                        onClick={copyAddress}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-[#0E335C] transition px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
                        title="Salin alamat"
                      >
                        {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        <span>{copied ? "Tersalin" : "Salin"}</span>
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {siteSettings.address}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Contact channels list */}
            {CONTACTS.map((c, i) => (
              <Reveal key={c.label} delay={0.08 * (i + 1)}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 hover:shadow-sm hover:border-[#0E335C]/35 transition-all group"
                >
                  <div className="grid place-items-center size-10 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 group-hover:bg-[#0E335C] group-hover:text-white group-hover:border-[#0E335C] transition-all shrink-0">
                    <c.icon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                      {c.label}
                    </p>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#0E335C] transition-colors truncate">
                      {c.value}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                      {c.desc}
                    </p>
                  </div>
                  <ExternalLink className="size-4 text-slate-400 group-hover:text-[#0E335C] transition-colors shrink-0" />
                </a>
              </Reveal>
            ))}
          </div>

          {/* Right Column: Embedded Map with Modern Frame */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15} className="h-full">
              <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs bg-white p-2.5 h-full min-h-[380px] flex flex-col justify-between">
                <div className="relative rounded-xl overflow-hidden flex-1 min-h-[320px] bg-slate-100 border border-slate-200/60">
                  <iframe
                    title={`Peta Lokasi ${siteSettings.name}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(siteSettings.address)}&output=embed`}
                    className="size-full min-h-[320px] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-3 right-3 pointer-events-auto">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-bold text-[#0E335C] shadow-md border border-slate-200 hover:bg-[#0E335C] hover:text-white transition-all"
                    >
                      <MapPin className="size-3.5" />
                      <span>Buka Google Maps</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>
                <div className="pt-2.5 px-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate">Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan</span>
                  <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">Kode Pos 12740</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
