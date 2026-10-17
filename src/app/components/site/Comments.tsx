import { useState } from "react";
import { toast } from "sonner";
import { Send, MessageSquareHeart, Clock } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore } from "../../data/store";

function timeAgo(iso: string) {
  if (!iso) return "Baru saja";
  const timestamp = new Date(iso).getTime();
  if (isNaN(timestamp)) return "Baru saja";
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} hari lalu`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} bulan lalu`;
  const year = Math.floor(month / 12);
  return `${year} tahun lalu`;
}

function getInitial(name: string) {
  if (!name) return "W";
  return name.trim().charAt(0).toUpperCase();
}

export function Comments() {
  const { comments, addComment } = useStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Nama dan pesan komentar wajib diisi.");
      return;
    }
    setSending(true);
    try {
      await addComment(name.trim(), message.trim());
      setMessage("");
      toast.success("Pesan Anda berhasil terkirim. Terima kasih atas partisipasinya!");
    } catch {
      // error handled in store
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="komentar" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Buku Tamu & Aspirasi"
            title="Suara & Kesan Warga RW 10"
            desc="Sampaikan kesan, pesan kemerdekaan, doa, atau saran membangun untuk pemuda-pemudi Kataruma RW 10."
          />
        </Reveal>

        {/* Comment Form Card */}
        <Reveal delay={0.1}>
          <form
            onSubmit={submit}
            className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 sm:p-6 space-y-4 shadow-2xs"
          >
            <div>
              <label htmlFor="comment-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-heading">
                Nama Lengkap / Panggilan
              </label>
              <div className="relative">
                <input
                  id="comment-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pak Haji Bambang (RT 03) / Rian"
                  maxLength={60}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0E335C] focus:ring-2 focus:ring-[#0E335C]/10 transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="comment-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-heading">
                  Pesan atau Kesan Anda
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {message.length}/500
                </span>
              </div>
              <textarea
                id="comment-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan ucapan, doa, atau kesan kemeriahan acara RW 10..."
                maxLength={500}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0E335C] focus:ring-2 focus:ring-[#0E335C]/10 transition resize-none shadow-2xs"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Pesan akan langsung tampil di buku tamu warga.
              </span>
              <button
                type="submit"
                disabled={sending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E335C] text-white hover:bg-[#071B33] transition-all font-semibold text-sm shadow-sm disabled:opacity-50 ml-auto"
              >
                <Send className="size-4" />
                <span>{sending ? "Mengirim..." : "Kirim Pesan Warga"}</span>
              </button>
            </div>
          </form>
        </Reveal>

        {/* Comments Feed */}
        <div className="mt-10 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-slate-200/90 bg-slate-50 flex flex-col items-center gap-2.5">
              <div className="grid place-items-center size-10 rounded-xl bg-white text-slate-400 border border-slate-200 shadow-2xs">
                <MessageSquareHeart className="size-5" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm font-heading">Belum Ada Komentar</p>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Jadilah warga pertama yang menitipkan pesan atau kesan!</p>
              </div>
            </div>
          ) : (
            comments.map((c, i) => (
              <Reveal key={c.id} delay={Math.min(i * 0.04, 0.25)}>
                <div className="flex items-start gap-3.5 rounded-xl border border-slate-200/90 bg-white p-4 sm:p-4.5 hover:shadow-2xs transition">
                  <span className="grid place-items-center size-10 shrink-0 rounded-xl bg-slate-100 text-[#0E335C] font-bold font-mono text-sm border border-slate-200">
                    {getInitial(c.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <p className="text-sm font-bold font-heading text-slate-900">{c.name}</p>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="size-3" />
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                      {c.message}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
