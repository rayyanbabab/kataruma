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

export function Countdown({ date, compact }: { date: string; compact?: boolean }) {
  const target = parseTargetDate(date);
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const tgt = parseTargetDate(date);
    setT(diff(tgt));
    const id = setInterval(() => setT(diff(tgt)), 1000);
    return () => clearInterval(id);
  }, [date]);

  if (t.isPast) {
    return <span className="text-sm text-white/70" style={{ fontWeight: 600 }}>✓ Selesai</span>;
  }

  if (t.isToday || t.done) {
    return <span className="text-sm text-[#D4AF37]" style={{ fontWeight: 600 }}>🎉 Hari ini!</span>;
  }


  const items = [
    { v: t.days, l: "Hari" },
    { v: t.hours, l: "Jam" },
    { v: t.minutes, l: "Menit" },
    { v: t.seconds, l: "Detik" },
  ];

  if (compact) {
    return (
      <span className="text-sm text-[#0F4C81]" style={{ fontWeight: 600 }}>
        {t.days}h : {String(t.hours).padStart(2, "0")}j : {String(t.minutes).padStart(2, "0")}m : {String(t.seconds).padStart(2, "0")}d
      </span>
    );
  }

  return (
    <div className="flex gap-1.5">
      {items.map((i) => (
        <div key={i.l} className="flex-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur px-1.5 py-1.5 text-center">
          <div className="text-base text-white" style={{ fontWeight: 800 }}>{String(i.v).padStart(2, "0")}</div>
          <div className="text-[9px] text-white/70 uppercase tracking-wide">{i.l}</div>
        </div>
      ))}
    </div>
  );
}
