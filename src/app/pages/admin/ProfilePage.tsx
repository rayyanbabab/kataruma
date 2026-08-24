import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { useStore } from "../../data/store";
import { Field, inputClass } from "./ui";

export function ProfilePage() {
  const { adminProfile, updateAdminProfile, changePassword } = useStore();
  const [profile, setProfile] = useState({
    name: adminProfile.name,
    email: adminProfile.email,
    phone: adminProfile.phone,
  });

  useEffect(() => {
    setProfile({
      name: adminProfile.name,
      email: adminProfile.email,
      phone: adminProfile.phone,
    });
  }, [adminProfile]);

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const ok = await updateAdminProfile(profile);
    setSavingProfile(false);
    if (ok) toast.success("Profil berhasil diperbarui.");
  };

  const submitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next.length < 4) { toast.error("Password baru minimal 4 karakter."); return; }
    if (pwd.next !== pwd.confirm) { toast.error("Konfirmasi password tidak cocok."); return; }
    setBusy(true);
    const ok = await changePassword(pwd.next);
    setBusy(false);
    if (ok) {
      toast.success("Password berhasil diubah. Gunakan sandi baru untuk login berikutnya.");
      setPwd({ current: "", next: "", confirm: "" });
    }
  };

  const initials = profile.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Profil Admin</h1>
        <p className="text-muted-foreground text-sm">Kelola informasi akun administrator.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 flex items-center gap-5">
        <span className="grid place-items-center size-20 rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#D32F2F] text-white text-2xl" style={{ fontWeight: 800 }}>{initials || "AD"}</span>
        <div>
          <h2 className="text-[#0F4C81]" style={{ fontWeight: 700 }}>{adminProfile.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1"><ShieldCheck className="size-4 text-green-500" /> Administrator</p>
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="size-4" /> {adminProfile.email}</span>
            <span className="flex items-center gap-1"><Phone className="size-4" /> {adminProfile.phone}</span>
          </div>
        </div>
      </div>

      <form onSubmit={submitProfile} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>Informasi Akun</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nama Lengkap"><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} required /></Field>
          <Field label="Username"><input value="admin" disabled className={inputClass + " opacity-50 cursor-not-allowed"} /></Field>
          <Field label="Email"><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} /></Field>
          <Field label="No. Telepon"><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} /></Field>
        </div>
        <button disabled={savingProfile} className="px-6 py-2.5 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition disabled:opacity-60" style={{ fontWeight: 600 }}>
          {savingProfile ? "Menyimpan…" : "Simpan Profil"}
        </button>
      </form>

      <form onSubmit={submitPwd} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>Ubah Password</h3>
        <Field label="Password Saat Ini"><input type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} className={inputClass} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Password Baru"><input type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} className={inputClass} /></Field>
          <Field label="Konfirmasi Password"><input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={inputClass} /></Field>
        </div>
        <button disabled={busy} className="px-6 py-2.5 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition disabled:opacity-60" style={{ fontWeight: 600 }}>{busy ? "Menyimpan…" : "Ubah Password"}</button>
      </form>
    </div>
  );
}
