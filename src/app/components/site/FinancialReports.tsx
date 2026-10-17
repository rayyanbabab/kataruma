import { useMemo, useState, useEffect } from "react";
import { FileSpreadsheet, FileText, File as FileIcon, Download, ChevronDown, Wallet, X, Eye, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore, type Report, type ReportFileType } from "../../data/store";

const FILE_META: Record<ReportFileType, { label: string; badge: string; icon: typeof FileText }> = {
  xlsx: { label: "Excel (.xlsx)", badge: "XLSX", icon: FileSpreadsheet },
  pdf: { label: "Dokumen PDF", badge: "PDF", icon: FileText },
  docx: { label: "Word (.docx)", badge: "DOCX", icon: FileText },
  other: { label: "Berkas Lampiran", badge: "FILE", icon: FileIcon },
};

function PreviewModal({ report, onClose }: { report: Report; onClose: () => void }) {
  const meta = FILE_META[report.fileType] || FILE_META.other;
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 p-5 border-b border-slate-100">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {meta.badge}
              </span>
              <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 truncate">{report.title}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">Tahun Anggaran {report.year} &middot; {meta.label}</p>
          </div>
          <button
            onClick={onClose}
            className="grid place-items-center size-9 shrink-0 rounded-lg hover:bg-slate-100 text-slate-500 transition border border-transparent hover:border-slate-200"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50 p-4">
          {report.fileType === "pdf" ? (
            <iframe src={report.fileUrl} title={report.title} className="w-full h-full min-h-[62vh] rounded-xl bg-white shadow-inner border border-slate-200" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[42vh] p-8 text-center bg-white rounded-xl border border-slate-200">
              <span className="grid place-items-center size-14 rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
                <meta.icon className="size-7" />
              </span>
              <div>
                <p className="font-bold text-slate-900 text-base font-heading">{report.fileName || report.title}</p>
                <p className="text-slate-500 text-xs sm:text-sm max-w-sm mt-1.5 leading-relaxed">
                  Pratinjau langsung di peramban hanya didukung untuk berkas PDF. Silakan unduh untuk membuka berkas {meta.label}.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
          <a
            href={report.fileUrl}
            download={report.fileName}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0E335C] text-white hover:bg-[#071B33] transition font-semibold text-sm shadow-sm"
          >
            <Download className="size-4" /> Unduh Berkas {meta.label}
          </a>
        </div>
      </div>
    </div>
  );
}

function ReportRow({ r, onOpen }: { r: Report; onOpen: () => void }) {
  const meta = FILE_META[r.fileType] || FILE_META.other;
  const Icon = meta.icon;
  return (
    <div
      onClick={onOpen}
      className="flex items-center gap-3.5 rounded-xl border border-slate-200/90 bg-white p-3.5 hover:shadow-sm hover:border-[#0E335C]/40 transition group text-left cursor-pointer"
    >
      <span className="grid place-items-center size-10 shrink-0 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 group-hover:bg-[#0E335C] group-hover:text-white group-hover:border-[#0E335C] transition-colors">
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase shrink-0">
            {meta.badge}
          </span>
          <p className="text-xs sm:text-sm font-bold font-heading text-slate-900 group-hover:text-[#0E335C] transition-colors truncate">
            {r.title}
          </p>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{meta.label}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span className="text-xs font-semibold text-slate-400 group-hover:text-[#0E335C] transition-colors flex items-center gap-1">
          <Eye className="size-3.5" />
          <span className="hidden sm:inline">Buka</span>
        </span>
      </div>
    </div>
  );
}

export function FinancialReports() {
  const { reports } = useStore();
  const byYear = useMemo(() => {
    const map = new Map<number, Report[]>();
    for (const r of reports) {
      if (!map.has(r.year)) map.set(r.year, []);
      map.get(r.year)!.push(r);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [reports]);

  const [openYear, setOpenYear] = useState<number | null>(byYear[0]?.[0] ?? null);
  const [preview, setPreview] = useState<Report | null>(null);

  useEffect(() => {
    if (openYear === null && byYear.length > 0) {
      setOpenYear(byYear[0][0]);
    }
  }, [byYear, openYear]);

  if (reports.length === 0) return null;

  return (
    <section id="laporan-keuangan" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Transparansi Kas"
            title="Laporan Pertanggungjawaban Keuangan"
            desc="Wujud komitmen amanah pemuda Kataruma RW 10 dalam mengelola anggaran dan donasi warga secara transparan dan akuntabel."
          />
        </Reveal>

        {/* Transparency Banner Card */}
        <Reveal delay={0.05}>
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid place-items-center size-11 rounded-xl bg-[#0E335C] text-white shrink-0 shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900">
                  Keterbukaan Informasi Publik RW 10
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Setiap dokumen pembukuan dapat diunduh dan diperiksa oleh seluruh warga.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg text-[11px] font-mono font-semibold bg-white text-slate-700 border border-slate-200 shrink-0">
              {reports.length} Berkas Arsip
            </span>
          </div>
        </Reveal>

        {/* Year Accordions */}
        <div className="space-y-4">
          {byYear.map(([year, list], i) => {
            const open = openYear === year;
            return (
              <Reveal key={year} delay={i * 0.06}>
                <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/70 shadow-2xs transition-all">
                  <button
                    onClick={() => setOpenYear(open ? null : year)}
                    className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-slate-100/70 transition"
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="grid place-items-center size-10 rounded-xl bg-[#0E335C] text-white shadow-2xs">
                        <Wallet className="size-4.5" />
                      </span>
                      <div>
                        <span className="block text-sm sm:text-base font-bold font-heading text-slate-900">
                          Tahun Anggaran {year}
                        </span>
                        <span className="block text-xs text-slate-500 font-mono">
                          {list.length} Dokumen Pembukuan & Bukti Pengeluaran
                        </span>
                      </div>
                    </span>
                    <span className="grid place-items-center size-8 rounded-lg bg-white border border-slate-200 text-slate-600">
                      <ChevronDown className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </span>
                  </button>

                  {open && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                      {list.map((r) => (
                        <ReportRow key={r.id} r={r} onOpen={() => setPreview(r)} />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      {preview && <PreviewModal report={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}
