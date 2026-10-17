import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Flag, CalendarCheck, Moon, Clock, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { useStore, formatDate, type AgendaEvent } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { Countdown } from "./Countdown";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DOW = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const EventIcon = ({ type, className }: { type: AgendaEvent["type"]; className?: string }) =>
  type === "national" ? <Flag className={className} strokeWidth={1.75} /> : type === "islamic" ? <Moon className={className} strokeWidth={1.75} /> : <CalendarCheck className={className} strokeWidth={1.75} />;

export function Kalender() {
  const { events } = useStore();
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const eventsByDay = useMemo(() => {
    const map: Record<string, AgendaEvent[]> = {};
    events.forEach((e) => {
      (map[e.date] ??= []).push(e);
    });
    return map;
  }, [events]);

  const getLocalTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const upcoming = useMemo(() => {
    const todayStr = getLocalTodayStr();
    return [...events]
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4);
  }, [events]);

  const countdowns = useMemo(() => {
    const todayStr = getLocalTodayStr();
    return [...events]
      .filter((e) => e.date >= todayStr && e.showCountdown)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3);
  }, [events]);

  const first = new Date(cursor.y, cursor.m, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const dateStr = (d: number) => `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const isToday = (d: number) => today.getFullYear() === cursor.y && today.getMonth() === cursor.m && today.getDate() === d;

  const move = (dir: number) => {
    setCursor((c) => {
      const m = c.m + dir;
      if (m < 0) return { y: c.y - 1, m: 11 };
      if (m > 11) return { y: c.y + 1, m: 0 };
      return { ...c, m };
    });
  };

  const resetToToday = () => {
    setCursor({ y: today.getFullYear(), m: today.getMonth() });
  };

  return (
    <section id="kalender" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Agenda & Kalender"
            title="Jadwal Acara & Peringatan Penting"
            desc="Informasi jadwal kegiatan kepemudaan Kataruma RW 10, hari besar nasional, dan hari raya keagamaan."
          />
        </Reveal>

        {/* Highlight Countdown Spotlight Cards */}
        {countdowns.length > 0 && (
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {countdowns.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.08}>
                <div className="rounded-2xl p-6 bg-[#071B33] text-white shadow-lg border border-slate-800 flex flex-col justify-between h-full relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider font-mono ${
                          e.type === "national"
                            ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                            : e.type === "islamic"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                        }`}
                      >
                        <EventIcon type={e.type} className="size-3" />
                        {e.type === "national" ? "Hari Nasional" : e.type === "islamic" ? "Hari Besar Islam" : "Kegiatan RW 10"}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{formatDate(e.date)}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold font-heading text-white line-clamp-2 leading-snug mb-5">
                      {e.title}
                    </h3>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-white/10">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center gap-1.5 font-mono">
                      <Clock className="size-3 text-amber-400" strokeWidth={1.75} />
                      Hitung Mundur Waktu:
                    </p>
                    <Countdown date={e.date} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Calendar View */}
          <div className="lg:col-span-8">
            <Reveal>
              <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
                {/* Header Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="grid place-items-center size-10 rounded-xl bg-[#0E335C] text-white">
                      <CalendarDays className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 leading-tight">
                        {MONTHS[cursor.m]} {cursor.y}
                      </h3>
                      <p className="text-xs text-slate-500">Pilih tanggal untuk melihat rincian agenda</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetToToday}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-sm"
                    >
                      Bulan Ini
                    </button>
                    <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-sm">
                      <button
                        onClick={() => move(-1)}
                        className="grid place-items-center size-8 rounded-md hover:bg-slate-100 text-slate-700 transition"
                        aria-label="Bulan sebelumnya"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        onClick={() => move(1)}
                        className="grid place-items-center size-8 rounded-md hover:bg-slate-100 text-slate-700 transition"
                        aria-label="Bulan berikutnya"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-slate-400 mb-2">
                  {DOW.map((d, idx) => (
                    <div key={d} className={`py-1.5 ${idx === 0 ? "text-[#C92A2A]" : ""}`}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Month Grid Cells */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {cells.map((d, i) => {
                    if (d === null) return <div key={i} className="min-h-16 rounded-xl" />;
                    const evs = eventsByDay[dateStr(d)] ?? [];
                    const currentDay = isToday(d);
                    const isSunday = (i % 7) === 0;

                    return (
                      <div
                        key={i}
                        className={`min-h-16 sm:min-h-20 rounded-xl p-1.5 sm:p-2 text-left border transition-all flex flex-col justify-between ${
                          currentDay
                            ? "border-[#C92A2A] bg-rose-50/60 shadow-sm"
                            : evs.length
                            ? "border-[#0E335C]/20 bg-white shadow-xs"
                            : "border-slate-200/60 bg-white/70 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold size-6 rounded-full flex items-center justify-center ${
                              currentDay
                                ? "bg-[#C92A2A] text-white"
                                : isSunday
                                ? "text-[#C92A2A]"
                                : "text-slate-800"
                            }`}
                          >
                            {d}
                          </span>
                        </div>

                        {/* Event Tags inside date cell */}
                        <div className="space-y-1 mt-1">
                          {evs.slice(0, 2).map((e) => (
                            <div
                              key={e.id}
                              title={`${e.title} (${e.description || ""})`}
                              className={`truncate text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                e.type === "national"
                                  ? "bg-rose-100 text-rose-800"
                                  : e.type === "islamic"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-900 font-semibold"
                              }`}
                            >
                              {e.title}
                            </div>
                          ))}
                          {evs.length > 2 && (
                            <div className="text-[10px] font-semibold text-slate-500 px-1">
                              +{evs.length - 2} lagi
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#C92A2A]" />
                    <span>Hari Besar Nasional</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-600" />
                    <span>Hari Besar Islam</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    <span>Agenda Kataruma RW 10</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar: Upcoming Agenda */}
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                    <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900">
                      Agenda Mendatang
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {upcoming.length} Acara
                    </span>
                  </div>

                  {upcoming.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      Belum ada agenda mendatang yang terdaftar.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.map((e) => (
                        <div
                          key={e.id}
                          className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs"
                        >
                          <div
                            className={`grid place-items-center size-9 rounded-lg text-white shrink-0 mt-0.5 ${
                              e.type === "national"
                                ? "bg-[#C92A2A]"
                                : e.type === "islamic"
                                ? "bg-emerald-700"
                                : "bg-[#0E335C]"
                            }`}
                          >
                            <EventIcon type={e.type} className="size-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 font-heading">
                              {e.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <CalendarIcon className="size-3" />
                              {formatDate(e.date)}
                            </p>
                            {e.showCountdown && (
                              <div className="mt-2">
                                <Countdown date={e.date} compact />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Jadwal diperbarui secara berkala oleh pengurus RW 10.</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
