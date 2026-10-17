import { useEffect, useState } from "react";

function parseTargetDate(dateStr: string): Date {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const parts = clean.split("-").map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
  }
  return new Date(dateStr);
}

function diff(target: Date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate(), 0, 0, 0);
  
  const isPast = targetDay.getTime() < startOfToday.getTime();
  const isToday = targetDay.getTime() === startOfToday.getTime();
  const ms = Math.max(0, target.getTime() - now.getTime());

  return {
    isPast,
    isToday,
    done: ms === 0,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

export function Countdown({
  date,
  compact,
  theme = "light",
}: {
  date: string;
  compact?: boolean;
  theme?: "light" | "dark";
}) {
  const target = parseTargetDate(date);
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const tgt = parseTargetDate(date);
    setT(diff(tgt));
    const id = setInterval(() => setT(diff(tgt)), 1000);
    return () => clearInterval(id);
  }, [date]);

  if (t.isPast) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
        Acara telah selesai
      </span>
    );
  }

  if (t.isToday || t.done) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#C92A2A] text-white font-mono">
        Hari ini: Kegiatan Berlangsung
      </span>
    );
  }

  const items = [
    { v: t.days, l: "Hari" },
    { v: t.hours, l: "Jam" },
    { v: t.minutes, l: "Mnt" },
    { v: t.seconds, l: "Dtk" },
  ];

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0E335C] font-mono">
        {t.days}h {String(t.hours).padStart(2, "0")}j {String(t.minutes).padStart(2, "0")}m {String(t.seconds).padStart(2, "0")}d
      </span>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {items.map((i) => (
        <div
          key={i.l}
          className={`rounded-lg px-2 py-2 text-center transition-all ${
            isDark
              ? "bg-slate-900/80 border border-slate-800 text-white"
              : "bg-white/10 border border-white/15 text-white"
          }`}
        >
          <div className="text-base sm:text-lg font-bold font-mono tracking-tight leading-none">
            {String(i.v).padStart(2, "0")}
          </div>
          <div className="text-[9px] uppercase tracking-wider font-semibold opacity-70 mt-1 font-mono">
            {i.l}
          </div>
        </div>
      ))}
    </div>
  );
}
