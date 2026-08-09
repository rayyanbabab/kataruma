import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";

const app = new Hono();
const P = "/make-server-35d97b10";

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const DEFAULT_ADMIN_SECRET = "201204";
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* ---- admin auth helper ------------------------------------------------ */
async function adminSecret(): Promise<string> {
  const s = await kv.get("admin_secret");
  return (s as string) || DEFAULT_ADMIN_SECRET;
}
async function requireAdmin(c: any): Promise<Response | null> {
  const provided = c.req.header("x-admin-secret");
  const secret = await adminSecret();
  if (!provided || provided !== secret) {
    return c.json({ error: "Unauthorized: sandi admin tidak valid." }, 401);
  }
  return null;
}

/* ---- health ----------------------------------------------------------- */
app.get(`${P}/health`, (c) => c.json({ status: "ok" }));

/* ---- login: validasi sandi, kembalikan secret untuk operasi tulis ----- */
app.post(`${P}/login`, async (c) => {
  try {
    const { username, password } = await c.req.json();
    const secret = await adminSecret();
    if ((username || "").trim() === "admin" && password === secret) {
      return c.json({ ok: true, secret });
    }
    return c.json({ ok: false }, 401);
  } catch (err) {
    console.log(`Login error: ${err}`);
    return c.json({ ok: false, error: `${err}` }, 500);
  }
});

/* ---- ganti sandi admin ------------------------------------------------ */
app.post(`${P}/change-password`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const { newPassword } = await c.req.json();
    if (!newPassword || String(newPassword).length < 4) {
      return c.json({ error: "Sandi baru minimal 4 karakter." }, 400);
    }
    await kv.set("admin_secret", String(newPassword));
    return c.json({ ok: true, secret: String(newPassword) });
  } catch (err) {
    console.log(`Change password error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- ambil semua data (publik) ---------------------------------------- */
app.get(`${P}/data`, async (c) => {
  try {
    const [albums, photos, videos, events, comments, reports, posters] = await Promise.all([
      kv.getByPrefix("album:"),
      kv.getByPrefix("photo:"),
      kv.getByPrefix("video:"),
      kv.getByPrefix("event:"),
      kv.getByPrefix("comment:"),
      kv.getByPrefix("report:"),
      kv.getByPrefix("poster:"),
    ]);
    const [autoPrefs, visitors, adminProfile, siteSettings] = await Promise.all([
      kv.get("autoprefs"),
      kv.get("visitors"),
      kv.get("admin_profile"),
      kv.get("site_settings"),
    ]);
    return c.json({
      albums: albums || [],
      photos: photos || [],
      videos: videos || [],
      customEvents: events || [],
      comments: (comments || []).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")),
      reports: reports || [],
      posters: posters || [],
      autoPrefs: autoPrefs || {},
      visitors: visitors || 0,
      adminProfile: adminProfile || null,
      siteSettings: siteSettings || null,
    });
  } catch (err) {
    console.log(`Get data error: ${err}`);
    return c.json({ error: `Gagal mengambil data: ${err}` }, 500);
  }
});

/* ---- penghitung pengunjung (publik) ----------------------------------- */
app.post(`${P}/visit`, async (c) => {
  try {
    const current = ((await kv.get("visitors")) as number) || 0;
    const next = current + 1;
    await kv.set("visitors", next);
    return c.json({ visitors: next });
  } catch (err) {
    console.log(`Visit error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- generic CRUD builder --------------------------------------------- */
function crud(name: string, prefix: string) {
  app.post(`${P}/${name}`, async (c) => {
    const unauth = await requireAdmin(c);
    if (unauth) return unauth;
    try {
      const body = await c.req.json();
      const id = body.id || uid();
      const item = { ...body, id };
      await kv.set(`${prefix}${id}`, item);
      return c.json(item);
    } catch (err) {
      console.log(`Create ${name} error: ${err}`);
      return c.json({ error: `${err}` }, 500);
    }
  });

  app.put(`${P}/${name}/:id`, async (c) => {
    const unauth = await requireAdmin(c);
    if (unauth) return unauth;
    try {
      const id = c.req.param("id");
      const patch = await c.req.json();
      const existing = (await kv.get(`${prefix}${id}`)) || { id };
      const item = { ...existing, ...patch, id };
      await kv.set(`${prefix}${id}`, item);
      return c.json(item);
    } catch (err) {
      console.log(`Update ${name} error: ${err}`);
      return c.json({ error: `${err}` }, 500);
    }
  });

  app.delete(`${P}/${name}/:id`, async (c) => {
    const unauth = await requireAdmin(c);
    if (unauth) return unauth;
    try {
      const id = c.req.param("id");
      await kv.del(`${prefix}${id}`);
      return c.json({ ok: true });
    } catch (err) {
      console.log(`Delete ${name} error: ${err}`);
      return c.json({ error: `${err}` }, 500);
    }
  });
}

crud("photo", "photo:");
crud("video", "video:");
crud("event", "event:");
crud("report", "report:");
crud("poster", "poster:");

/* ---- album (dengan cascade delete foto/video) ------------------------- */
app.post(`${P}/album`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const body = await c.req.json();
    const id = body.id || uid();
    const item = { ...body, id };
    await kv.set(`album:${id}`, item);
    return c.json(item);
  } catch (err) {
    console.log(`Create album error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

app.put(`${P}/album/:id`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const id = c.req.param("id");
    const patch = await c.req.json();
    const existing = (await kv.get(`album:${id}`)) || { id };
    const item = { ...existing, ...patch, id };
    await kv.set(`album:${id}`, item);
    return c.json(item);
  } catch (err) {
    console.log(`Update album error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

app.delete(`${P}/album/:id`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const id = c.req.param("id");
    await kv.del(`album:${id}`);
    // cascade: hapus foto & video milik album ini
    const [photos, videos] = await Promise.all([kv.getByPrefix("photo:"), kv.getByPrefix("video:")]);
    const delKeys = [
      ...(photos || []).filter((p: any) => p.albumId === id).map((p: any) => `photo:${p.id}`),
      ...(videos || []).filter((v: any) => v.albumId === id).map((v: any) => `video:${v.id}`),
    ];
    if (delKeys.length) await kv.mdel(delKeys);
    return c.json({ ok: true });
  } catch (err) {
    console.log(`Delete album error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- komentar (kirim publik, hapus khusus admin) ---------------------- */
app.post(`${P}/comment`, async (c) => {
  try {
    const body = await c.req.json();
    const name = String(body.name || "").trim().slice(0, 60);
    const message = String(body.message || "").trim().slice(0, 500);
    if (!name || !message) {
      return c.json({ error: "Nama dan komentar wajib diisi." }, 400);
    }
    const id = uid();
    const item = { id, name, message, createdAt: new Date().toISOString() };
    await kv.set(`comment:${id}`, item);
    return c.json(item);
  } catch (err) {
    console.log(`Create comment error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

app.delete(`${P}/comment/:id`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const id = c.req.param("id");
    await kv.del(`comment:${id}`);
    return c.json({ ok: true });
  } catch (err) {
    console.log(`Delete comment error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- preferensi hitung mundur hari nasional/Islam --------------------- */
app.put(`${P}/autoprefs`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const { id, show } = await c.req.json();
    const prefs = ((await kv.get("autoprefs")) as Record<string, boolean>) || {};
    prefs[id] = !!show;
    await kv.set("autoprefs", prefs);
    return c.json(prefs);
  } catch (err) {
    console.log(`Autoprefs error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- profil admin (GET publik, PUT admin) ------------------------------ */
const DEFAULT_PROFILE = {
  name: "Diki Fadillah",
  email: "diki.fadillah@rt02.id",
  phone: "+62 812-3456-7890",
};
app.get(`${P}/profile`, async (c) => {
  try {
    const profile = (await kv.get("admin_profile")) || DEFAULT_PROFILE;
    return c.json(profile);
  } catch (err) {
    return c.json(DEFAULT_PROFILE);
  }
});
app.put(`${P}/profile`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const body = await c.req.json();
    const profile = {
      name: String(body.name || DEFAULT_PROFILE.name).trim().slice(0, 100),
      email: String(body.email || DEFAULT_PROFILE.email).trim().slice(0, 200),
      phone: String(body.phone || DEFAULT_PROFILE.phone).trim().slice(0, 50),
    };
    await kv.set("admin_profile", profile);
    return c.json({ ok: true, profile });
  } catch (err) {
    console.log(`Profile error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- pengaturan situs (GET publik, PUT admin) -------------------------- */
const DEFAULT_SITE_SETTINGS = {
  name: "Remaja Karang Taruna RT 02",
  tagline: "Bersama Berkarya, Bersatu Membangun Lingkungan",
  email: "karangtaruna.rt02@gmail.com",
  whatsapp: "+62 812-3456-7890",
  instagram: "@karangtaruna.rt02",
  address: "Jl. Kalibata Tengah XVI, RT.02/RW.003, Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan, DKI Jakarta 12740",
  autoIndex: true,
  lazyLoad: true,
  publicDownload: true,
};
app.get(`${P}/site-settings`, async (c) => {
  try {
    const settings = (await kv.get("site_settings")) || DEFAULT_SITE_SETTINGS;
    return c.json(settings);
  } catch (err) {
    return c.json(DEFAULT_SITE_SETTINGS);
  }
});
app.put(`${P}/site-settings`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const body = await c.req.json();
    const settings = {
      name: String(body.name || "").trim().slice(0, 200),
      tagline: String(body.tagline || "").trim().slice(0, 300),
      email: String(body.email || "").trim().slice(0, 200),
      whatsapp: String(body.whatsapp || "").trim().slice(0, 50),
      instagram: String(body.instagram || "").trim().slice(0, 100),
      address: String(body.address || "").trim().slice(0, 500),
      autoIndex: !!body.autoIndex,
      lazyLoad: !!body.lazyLoad,
      publicDownload: !!body.publicDownload,
    };
    await kv.set("site_settings", settings);
    return c.json({ ok: true, settings });
  } catch (err) {
    console.log(`Site settings error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

Deno.serve(app.fetch);
