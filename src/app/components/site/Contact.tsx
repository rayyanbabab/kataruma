import { MapPin, Phone, Instagram, Mail } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore } from "../../data/store";

export function Contact() {
  const { siteSettings } = useStore();

  const CONTACTS = [
    {
      icon: Phone,
      label: "WhatsApp",
      value: siteSettings.whatsapp,
      href: `https://wa.me/${siteSettings.whatsapp.replace(/\D/g, "")}`,
      color: "#25D366",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: siteSettings.instagram,
      href: `https://instagram.com/${siteSettings.instagram.replace("@", "")}`,
      color: "#E1306C",
    },
    {
      icon: Mail,
      label: "Email",
      value: siteSettings.email,
      href: `mailto:${siteSettings.email}`,
      color: "#0F4C81",
    },
  ];

  return (
    <section id="kontak" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow="Kontak" title="Hubungi Kami" desc="Terhubung dengan kami melalui kanal berikut." />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="space-y-5">
              <div className="rounded-2xl border border-black/5 bg-[#F5F7FA] p-6">
                <div className="flex gap-4">
                  <span className="grid place-items-center size-12 rounded-xl bg-[#0F4C81] text-white shrink-0"><MapPin className="size-6" /></span>
                  <div>
                    <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>{siteSettings.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {siteSettings.address}
                    </p>
                  </div>
                </div>
              </div>

              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <span className="grid place-items-center size-12 rounded-xl text-white shrink-0" style={{ background: c.color }}>
                    <c.icon className="size-6" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.label}</p>
                    <p style={{ fontWeight: 600 }}>{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-black/5 shadow-lg h-full min-h-[420px]">
              <iframe
                title={`Lokasi ${siteSettings.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(siteSettings.address)}&output=embed`}
                className="size-full min-h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
