import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check, X, GripVertical } from "lucide-react";
import { useStore } from "../../data/store";
import type { Donor } from "../../data/store";
import { Field, inputClass } from "./ui";

/* ------------------------------------------------------------------ */
/* Sub-komponen: baris donatur                                         */
/* ------------------------------------------------------------------ */

function DonorRow({
  donor,
  onUpdate,
  onDelete,
}: {
  donor: Donor;
  onUpdate: (id: string, patch: Partial<Donor>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(donor.name);
  const [note, setNote] = useState(donor.note ?? "");

  const save = () => {
    if (!name.trim()) return;
    onUpdate(donor.id, { name: name.trim(), note: note.trim() || undefined });
    setEditing(false);
    toast.success("Donatur diperbarui.");
  };

  const cancel = () => {
    setName(donor.name);
    setNote(donor.note ?? "");
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-[#0F4C81]/20">
        <GripVertical className="size-4 text-muted-foreground shrink-0" />
        <div className="flex-1 grid sm:grid-cols-2 gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama donatur"
            className={inputClass + " !py-1.5 text-sm"}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Keterangan (opsional)"
            className={inputClass + " !py-1.5 text-sm"}
            onKeyDown={(e) => e.key === "Enter" && save()}
          />
        </div>
        <button
          onClick={save}
          className="grid place-items-center size-8 rounded-lg bg-[#0F4C81] text-white hover:bg-[#0b3660] transition shrink-0"
          title="Simpan"
        >
          <Check className="size-4" />
        </button>
        <button
          onClick={cancel}
          className="grid place-items-center size-8 rounded-lg bg-[#F5F7FA] hover:bg-black/10 transition shrink-0"
          title="Batal"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F7FA] hover:bg-white border border-transparent hover:border-black/5 hover:shadow-sm transition group">
      <GripVertical className="size-4 text-muted-foreground shrink-0 opacity-50" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0F4C81] truncate">{donor.name}</p>
        {donor.note && <p className="text-xs text-muted-foreground truncate">{donor.note}</p>}
      </div>
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="grid place-items-center size-8 rounded-lg hover:bg-[#0F4C81]/10 text-[#0F4C81] transition"
          title="Edit"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={() => {
            if (confirm(`Hapus donatur "${donor.name}"?`)) {
              onDelete(donor.id);
              toast.success("Donatur dihapus.");
            }
          }}
          className="grid place-items-center size-8 rounded-lg hover:bg-red-50 text-red-500 transition"
          title="Hapus"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                           */
/* ------------------------------------------------------------------ */

export function SettingsPage() {
  const { siteSettings, updateSiteSettings, donors, addDonor, updateDonor, deleteDonor } = useStore();
  const [site, setSite] = useState({ ...siteSettings });
  const [busy, setBusy] = useState(false);

  // form tambah donatur baru
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [addingDonor, setAddingDonor] = useState(false);

  // Sinkron jika siteSettings berubah dari server
  useEffect(() => {
    setSite({ ...siteSettings });
  }, [siteSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const ok = await updateSiteSettings(site);
    setBusy(false);
    if (ok) toast.success("Pengaturan berhasil disimpan.");
  };

  const handleAddDonor = () => {
    if (!newName.trim()) return;
    addDonor({ name: newName.trim(), note: newNote.trim() || undefined });
    setNewName("");
    setNewNote("");
    setAddingDonor(false);
    toast.success("Donatur berhasil ditambahkan.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Pengaturan</h1>
        <p className="text-muted-foreground text-sm">Kelola informasi umum website dan preferensi.</p>
      </div>

      {/* ---- Informasi Umum ---- */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>Informasi Umum</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nama Organisasi">
            <input value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} className={inputClass} required />
          </Field>
          <Field label="Tagline">
            <input value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} className={inputClass} />
          </Field>
          <Field label="WhatsApp">
            <input value={site.whatsapp} onChange={(e) => setSite({ ...site, whatsapp: e.target.value })} className={inputClass} />
          </Field>
          <Field label="Instagram">
            <input value={site.instagram} onChange={(e) => setSite({ ...site, instagram: e.target.value })} className={inputClass} />
          </Field>
        </div>
        <Field label="Alamat">
          <textarea value={site.address} onChange={(e) => setSite({ ...site, address: e.target.value })} rows={2} className={inputClass} />
        </Field>

        <h3 className="text-[#0F4C81] pt-2" style={{ fontWeight: 600 }}>Preferensi</h3>
        <div className="space-y-3">
          {([
            ["autoIndex", "Indeks otomatis media ke mesin pencari"],
            ["lazyLoad", "Aktifkan lazy loading gambar"],
            ["publicDownload", "Izinkan pengunjung mengunduh foto"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA]">
              <span className="text-sm">{label}</span>
              <input
                type="checkbox"
                checked={site[key]}
                onChange={(e) => setSite({ ...site, [key]: e.target.checked })}
                className="accent-[#0F4C81] size-5"
              />
            </label>
          ))}
        </div>

        <button disabled={busy} className="px-6 py-2.5 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition disabled:opacity-60" style={{ fontWeight: 600 }}>
          {busy ? "Menyimpan…" : "Simpan Pengaturan"}
        </button>
      </form>

      {/* ---- Ucapan Terima Kasih / Donatur ---- */}
      <div className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>Ucapan Terima Kasih</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kelola daftar nama donatur yang tampil di halaman publik.
            </p>
          </div>
          <button
            onClick={() => setAddingDonor((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F4C81] text-white text-sm hover:bg-[#0b3660] transition"
            style={{ fontWeight: 600 }}
          >
            <Plus className="size-4" />
            Tambah
          </button>
        </div>

        {/* Form tambah baru */}
        {addingDonor && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200">
            <div className="flex-1 grid sm:grid-cols-2 gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama donatur *"
                className={inputClass + " !py-1.5 text-sm"}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAddDonor()}
              />
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Keterangan (opsional)"
                className={inputClass + " !py-1.5 text-sm"}
                onKeyDown={(e) => e.key === "Enter" && handleAddDonor()}
              />
            </div>
            <button
              onClick={handleAddDonor}
              disabled={!newName.trim()}
              className="grid place-items-center size-8 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-40 shrink-0"
              title="Tambah"
            >
              <Check className="size-4" />
            </button>
            <button
              onClick={() => { setAddingDonor(false); setNewName(""); setNewNote(""); }}
              className="grid place-items-center size-8 rounded-lg bg-[#F5F7FA] hover:bg-black/10 transition shrink-0"
              title="Batal"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Daftar donatur */}
        {donors.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            <p>Belum ada donatur. Klik <strong>Tambah</strong> untuk menambahkan nama.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {donors.map((d) => (
              <DonorRow
                key={d.id}
                donor={d}
                onUpdate={updateDonor}
                onDelete={deleteDonor}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground pt-1">
          Total: <strong>{donors.length}</strong> donatur terdaftar. Perubahan langsung tampil di halaman publik.
        </p>
      </div>
    </div>
  );
}
