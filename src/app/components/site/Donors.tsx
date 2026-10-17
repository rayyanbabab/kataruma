import { Reveal, SectionHeading } from "./Reveal";
import { HeartHandshake, MessageCircleQuestion } from "lucide-react";
import { useStore } from "../../data/store";

function getInitials(name: string) {
  if (!name) return "W";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Donors() {
  const { donors } = useStore();

  return (
    <section id="donatur" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Dinding Apresiasi Warga"
            title="Terima Kasih Kepada Para Donatur & Dermawan"
            desc="Terselenggaranya seluruh rangkaian kegiatan HUT RI dan Panggung Kemerdekaan RW 10 tidak lepas dari kebaikan hati Bapak/Ibu warga sekalian. Segala sumbangan materi, konsumsi, tenaga, dan doa menjadi bukti kuatnya gotong royong kita bersama."
          />
        </Reveal>

        {donors.length === 0 ? (
          <Reveal>
            <div className="text-center py-14 px-4 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-md mx-auto">
              <HeartHandshake className="size-8 text-[#0E335C] mx-auto mb-2 opacity-80" />
              <p className="text-slate-600 text-sm font-medium">
                Daftar donatur dan dermawan warga sedang diperbarui oleh panitia.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {donors.map((d, i) => {
              const initials = getInitials(d.name);
              return (
                <Reveal key={d.id} delay={i * 0.04}>
                  <div className="h-full flex items-center gap-3.5 rounded-xl border border-slate-200/90 bg-white p-3.5 hover:shadow-sm hover:border-[#0E335C]/30 transition-all duration-200 group">
                    <span className="grid place-items-center size-10 shrink-0 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold font-mono text-xs group-hover:bg-[#0E335C] group-hover:text-white group-hover:border-[#0E335C] transition-all duration-200 shadow-2xs">
                      {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold font-heading text-slate-900 group-hover:text-[#0E335C] transition-colors truncate">
                        {d.name}
                      </p>
                      {d.note ? (
                        <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
                          {d.note}
                        </p>
                      ) : (
                        <span className="inline-block text-[11px] text-slate-400 font-medium">
                          Warga RW 10 Kalibata
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal delay={0.15}>
          <div className="mt-10 p-4 rounded-2xl bg-white/70 border border-slate-200 text-center max-w-2xl mx-auto flex items-center justify-center gap-2.5 text-xs text-slate-500">
            <MessageCircleQuestion className="size-4 text-slate-400 shrink-0" />
            <span>
              Nama belum tercantum atau terdapat kekeliruan penulisan? Silakan hubungi panitia melalui kanal kontak di bawah untuk perbaikan data.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
