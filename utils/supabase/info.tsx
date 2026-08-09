// Supabase project: xovsyivddnxwwztcvsxb
export const projectId =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL)
    ? import.meta.env.VITE_SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")
    : "xovsyivddnxwwztcvsxb";

// JWT anon key (dipakai sebagai Bearer token ke Edge Function)
export const publicAnonKey =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY)
    || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvdnN5aXZkZG54d3d6dGN2c3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDg2MDksImV4cCI6MjEwMTgyNDYwOX0.3TaQ24I3RoNa2pGWYSlqQFCnrMEnsHRvUlK5QC66LmA";

export const supabaseUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL)
    || `https://${projectId}.supabase.co`;