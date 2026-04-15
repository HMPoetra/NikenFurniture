"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Building2, Star, Mail, Grid, Wrench, MessageSquare, 
  LogOut, Save, Plus, X, Trash2, Edit3, Eraser, Upload, ImagePlus, PanelLeft
} from "lucide-react";

const ADMIN_TOKEN_KEY = "admin_token";

/* ─────────────────────────────────────────────────────────────
   KONFIGURASI SEKSI
───────────────────────────────────────────────────────────── */
type SeksiId = "admin_users" | "company_info" | "experiences" | "pesan_kotak" | "portfolio_items" | "services" | "testimonials";

const seksiMenu: { id: SeksiId; judul: string; ikon: any }[] = [
  { id: "company_info",    judul: "Info Perusahaan",  ikon: Building2 },
  { id: "services",        judul: "Layanan",           ikon: Wrench },
  { id: "portfolio_items", judul: "Portofolio",        ikon: Grid },
  { id: "experiences",     judul: "Pengalaman",        ikon: Star },
  { id: "testimonials",    judul: "Testimoni",         ikon: MessageSquare },
  { id: "pesan_kotak",     judul: "Kotak Pesan",       ikon: Mail },
  { id: "admin_users",     judul: "Pengguna Admin",    ikon: Users },
];

const metaSeksi: Record<SeksiId, { api: string; label: string }> = {
  admin_users:     { api: "/api/admin/admin_users", label: "Pengguna Admin" },
  company_info:    { api: "/api/admin/company",     label: "Info Perusahaan" },
  experiences:     { api: "/api/admin/experiences", label: "Pengalaman" },
  pesan_kotak:     { api: "/api/admin/pesan_kotak", label: "Kotak Pesan" },
  portfolio_items: { api: "/api/admin/portfolio",   label: "Portofolio" },
  services:        { api: "/api/admin/services",    label: "Layanan" },
  testimonials:    { api: "/api/admin/testimonials",label: "Testimoni" },
};

const headerTabel: Record<SeksiId, string[]> = {
  admin_users:     ["ID", "Nama Pengguna", "Peran", "Dibuat Pada"],
  company_info:    ["Kunci", "Nilai"],
  experiences:     ["ID", "Tahun", "Judul", "Deskripsi", "Urutan", "Aktif"],
  pesan_kotak:     ["ID", "Nama", "Telepon", "Email", "Layanan", "Lokasi", "Anggaran", "Pesan"],
  portfolio_items: ["ID", "Kategori", "Judul", "Lokasi", "Tahun", "Gambar", "Deskripsi", "Urutan", "Aktif"],
  services:        ["ID", "Slug", "Kategori", "Judul", "Deskripsi", "Fitur", "Warna", "Gambar", "Urutan", "Aktif"],
  testimonials:    ["ID", "Nama", "Jabatan", "Ulasan", "Rating", "Urutan", "Aktif"],
};

const kunciTabel: Record<SeksiId, string[]> = {
  admin_users:     ["id", "username", "role", "created_at"],
  company_info:    ["key", "value"],
  experiences:     ["id", "year", "title", "description", "urutan", "aktif"],
  pesan_kotak:     ["id", "nama", "telepon", "email", "layanan", "lokasi", "budget", "pesan"],
  portfolio_items: ["id", "category", "title", "location", "year", "image", "description", "urutan", "aktif"],
  services:        ["id", "slug", "category", "title", "description", "features", "color", "image", "urutan", "aktif"],
  testimonials:    ["id", "nama", "role", "text_ulasan", "rating", "urutan", "aktif"],
};

const fieldSeksi: Record<SeksiId, string[]> = {
  admin_users:     ["username", "password", "role"],
  company_info:    ["name", "tagline", "description", "address", "phone", "email", "instagram", "facebook", "youtube", "maps_embed", "founded", "projects", "clients", "team"],
  experiences:     ["year", "title", "description", "urutan", "aktif"],
  pesan_kotak:     ["nama", "telepon", "email", "layanan", "lokasi", "budget", "pesan"],
  portfolio_items: ["category", "title", "location", "year", "image", "description", "urutan", "aktif"],
  services:        ["slug", "category", "title", "description", "features", "color", "image", "urutan", "aktif"],
  testimonials:    ["nama", "role", "text_ulasan", "rating", "urutan", "aktif"],
};

const labelField: Record<SeksiId, Record<string, string>> = {
  admin_users:     { username: "Nama Pengguna", password: "Kata Sandi (baru)", role: "Peran (admin / superadmin)" },
  company_info:    { name: "Nama Perusahaan", tagline: "Tagline", description: "Deskripsi Perusahaan", address: "Alamat Lengkap", phone: "Nomor Telepon", email: "Alamat Email", instagram: "Akun Instagram", facebook: "Akun Facebook", youtube: "Akun YouTube", maps_embed: "Tautan Embed Maps", founded: "Tahun Berdiri", projects: "Jumlah Proyek", clients: "Jumlah Klien", team: "Jumlah Tim" },
  experiences:     { year: "Tahun", title: "Judul", description: "Deskripsi", urutan: "Urutan Tampil", aktif: "Aktif (true/false)" },
  pesan_kotak:     { nama: "Nama Pengirim", telepon: "Nomor Telepon", email: "Alamat Email", layanan: "Layanan Diminati", lokasi: "Lokasi Proyek", budget: "Estimasi Anggaran", pesan: "Isi Pesan" },
  portfolio_items: { category: "Kategori", title: "Judul Proyek", location: "Lokasi", year: "Tahun", image: "Path Gambar", description: "Deskripsi", urutan: "Urutan Tampil", aktif: "Aktif (true/false)" },
  services:        { slug: "Slug URL", category: "Kategori", title: "Judul Layanan", description: "Deskripsi", features: "Fitur (pisah koma)", color: "Kelas Warna Tailwind", image: "Path Gambar", urutan: "Urutan Tampil", aktif: "Aktif (true/false)" },
  testimonials:    { nama: "Nama Pelanggan", role: "Jabatan / Kota", text_ulasan: "Isi Ulasan", rating: "Rating (1–5)", urutan: "Urutan Tampil", aktif: "Aktif (true/false)" },
};

// Field yang perlu textarea (teks panjang)
const textareaFields = new Set(["description", "pesan", "text_ulasan", "features"]);

/* ─────────────────────────────────────────────────────────────
   KOMPONEN UTAMA
───────────────────────────────────────────────────────────── */
export default function DashboardAdmin() {
  const router = useRouter();
  const [token, setToken]             = useState("");
  const [memuat, setMemuat]           = useState(false);
  const [pesan, setPesan]             = useState<{ teks: string; tipe: "sukses" | "error" | "info" } | null>(null);
  const [seksiAktif, setSeksiAktif]   = useState<SeksiId>("company_info");
  const [items, setItems]             = useState<any[]>([]);
  const [form, setForm]               = useState<Record<string, any>>({});
  const [opsiKategori, setOpsiKategori] = useState<string[]>([]);
  const [kategoriBaru, setKategoriBaru] = useState("");
  const [unggahField, setUnggahField] = useState<string | null>(null);
  const [dragFieldAktif, setDragFieldAktif] = useState<string | null>(null);
  const [editingId, setEditingId]     = useState<number | string | null>(null);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const formRef                       = useRef<HTMLDivElement>(null);
  const fileInputRef                  = useRef<HTMLInputElement | null>(null);
  const pesanTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tampilPesan = (teks: string, tipe: "sukses" | "error" | "info" = "sukses") => {
    setPesan({ teks, tipe });
    if (pesanTimer.current) clearTimeout(pesanTimer.current);
    pesanTimer.current = setTimeout(() => setPesan(null), 4500);
  };

  useEffect(() => {
    const localToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!localToken) { router.push("/admin"); return; }
    setToken(localToken);
    muatSeksi(localToken, "company_info");
  }, [router]);

  useEffect(() => {
    if (!token) return;
    muatSeksi(token, seksiAktif);
    setForm({});
    setKategoriBaru("");
    setEditingId(null);
    setSidebarMobileOpen(false);
    setPesan(null);
  }, [seksiAktif, token]);

  useEffect(() => {
    if (seksiAktif !== "services" && seksiAktif !== "portfolio_items") {
      setOpsiKategori([]);
      return;
    }

    const bawaan = seksiAktif === "services"
      ? ["Konstruksi", "Renovasi", "Interior", "Desain"]
      : [];

    const dariData = items
      .map((item) => String(item?.category ?? "").trim())
      .filter(Boolean);

    setOpsiKategori([...new Set([...bawaan, ...dariData])]);
  }, [items, seksiAktif]);

  const muatSeksi = async (adminToken: string, seksi: SeksiId) => {
    setMemuat(true);
    try {
      const meta = metaSeksi[seksi];
      const res  = await fetch(meta.api, { headers: { "x-admin-token": adminToken } });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { localStorage.removeItem(ADMIN_TOKEN_KEY); router.push("/admin"); return; }
        tampilPesan(data.message || "Gagal memuat data", "error");
        setItems([]); return;
      }
      if (seksi === "company_info") {
        const obj = data.data || {};
        setItems(Object.entries(obj).map(([key, value]) => ({ key, value })));
      } else {
        setItems(data.data || []);
      }
    } catch {
      tampilPesan("Kesalahan koneksi ke server.", "error");
    } finally {
      setMemuat(false);
    }
  };

  const keluar = () => { localStorage.removeItem(ADMIN_TOKEN_KEY); router.push("/admin"); };

  const simpanItem = async () => {
    if (!token) return;

    if (
      fieldSeksi[seksiAktif].includes("category") &&
      form.category === "__new__" &&
      !kategoriBaru.trim()
    ) {
      tampilPesan("Kategori baru wajib diisi.", "error");
      return;
    }

    const meta = metaSeksi[seksiAktif];
    const body: Record<string, any> = {};
    for (const field of fieldSeksi[seksiAktif]) {
      if (field === "category") {
        const kategoriTerpilih =
          form[field] === "__new__"
            ? kategoriBaru.trim()
            : String(form[field] ?? "").trim();

        if (!kategoriTerpilih) continue;
        body[field] = kategoriTerpilih;
        continue;
      }

      if (form[field] === undefined || form[field] === "") continue;
      if (field === "features") {
        body[field] = [...new Set((form[field] as string).split(",").map((v: string) => v.trim()).filter(Boolean))];
      } else if (field === "aktif") {
        body[field] = form[field] === "1" || form[field] === "true" || form[field] === true;
      } else if (field === "urutan" || field === "rating") {
        body[field] = Number(form[field]) || 0;
      } else {
        body[field] = form[field];
      }
    }
    const method = editingId ? "PUT" : "POST";
    const url    = editingId ? `${meta.api}?id=${editingId}` : meta.api;
    const res    = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    tampilPesan(json.message || (res.ok ? "Berhasil disimpan" : "Gagal menyimpan"), res.ok ? "sukses" : "error");
    if (res.ok) { muatSeksi(token, seksiAktif); setForm({}); setKategoriBaru(""); setEditingId(null); }
  };

  const editItem = (item: any) => {
    const newForm: Record<string, any> = {};
    for (const field of fieldSeksi[seksiAktif]) {
      if (field === "features" && Array.isArray(item[field])) newForm[field] = item[field].join(", ");
      else newForm[field] = item[field] !== undefined ? String(item[field]) : "";
    }
    setEditingId(item.id ?? item.username ?? null);
    setForm(newForm);
    tampilPesan(`Mode edit aktif — ${metaSeksi[seksiAktif].label}`, "info");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hapusItem = async (itemId: number | string) => {
    if (!token) return;
    if (!confirm("Yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.")) return;
    const meta = metaSeksi[seksiAktif];
    const res  = await fetch(`${meta.api}?id=${itemId}`, { method: "DELETE", headers: { "x-admin-token": token } });
    const json = await res.json();
    tampilPesan(json.message || "Item berhasil dihapus", res.ok ? "sukses" : "error");
    if (res.ok) muatSeksi(token, seksiAktif);
  };

  const batalEdit = () => { setEditingId(null); setForm({}); setPesan(null); };

  const uploadGambar = async (file: File) => {
    if (!token) {
      tampilPesan("Sesi admin tidak ditemukan.", "error");
      return null;
    }

    if (!file.type.startsWith("image/")) {
      tampilPesan("File harus berupa gambar.", "error");
      return null;
    }

    const targetFolder = seksiAktif === "services" ? "services" : "portfolio";
    const body = new FormData();
    body.append("file", file);
    body.append("folder", targetFolder);

    try {
      setUnggahField("image");
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: { "x-admin-token": token },
        body,
      });
      const json = await res.json();

      if (!res.ok || !json.path) {
        tampilPesan(json.message || "Gagal mengunggah gambar.", "error");
        return null;
      }

      setForm((prev) => ({ ...prev, image: json.path }));
      tampilPesan("Gambar berhasil diunggah.", "sukses");
      return json.path as string;
    } catch {
      tampilPesan("Terjadi kesalahan saat mengunggah gambar.", "error");
      return null;
    } finally {
      setUnggahField(null);
      setDragFieldAktif(null);
    }
  };

  const handleDropGambar = async (
    e: DragEvent<HTMLDivElement>,
    field: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragFieldAktif(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (field !== "image") return;
    await uploadGambar(file);
  };

  const pilihFileGambar = (field: string) => {
    if (field !== "image") return;
    fileInputRef.current?.click();
  };

  const handlePilihGambar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadGambar(file);
    e.target.value = "";
  };

  /* ── RENDER BARIS TABEL ── */
  const renderBaris = (item: any, index: number) => {
    if (!item) return null;
    const kunci  = kunciTabel[seksiAktif];
    const rowKey = item.id ?? item.username ?? `${seksiAktif}-${index}`;
    return (
      <tr key={rowKey} className={`transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/60"} hover:bg-indigo-50/40`}>
        {kunci.map((k) => {
          const nilai = item[k];
          let tampilan: string;
          
          if (typeof nilai === "boolean" || nilai === "true" || nilai === "false") {
             const v = String(nilai) === "true";
             return (
               <td key={`${rowKey}-${k}`} className="px-4 py-3 text-xs border-b border-slate-100 align-top">
                 <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${v ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                   {v ? "Ya" : "Tidak"}
                 </span>
               </td>
             );
          }
          
          if (Array.isArray(nilai))      tampilan = nilai.join(", ");
          else if (nilai !== null && typeof nilai === "object") tampilan = JSON.stringify(nilai);
          else tampilan = String(nilai ?? "—");

          return (
            <td key={`${rowKey}-${k}`} className="px-4 py-3 text-xs text-slate-700 border-b border-slate-100 break-words whitespace-normal leading-relaxed align-top">
              {tampilan}
            </td>
          );
        })}
        <td className="px-4 py-3 text-xs border-b border-slate-100 align-top">
          <div className="flex gap-1.5 justify-end items-center whitespace-nowrap">
            <button onClick={() => editItem(item)} title="Ubah" className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 hover:shadow-sm">
              <Edit3 className="w-3 h-3" /> Ubah
            </button>
            {item.id && (
              <button onClick={() => hapusItem(item.id)} title="Hapus" className="inline-flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 hover:shadow-sm">
                <Trash2 className="w-3 h-3" /> Hapus
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const pesanWarna = {
    sukses: "bg-emerald-50 border-emerald-300 text-emerald-800",
    error:  "bg-red-50 border-red-300 text-red-800",
    info:   "bg-indigo-50 border-indigo-300 text-indigo-800",
  };

  const renderSidebarMenu = () => (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/60" style={{ background: "linear-gradient(160deg,#4f46e5 0%,#7c3aed 100%)" }}>
      <div className="px-4 py-4 border-b border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Menu Pengelolaan</p>
      </div>
      <nav className="p-2.5 space-y-1">
        {seksiMenu.map((sec) => {
          const aktif = seksiAktif === sec.id;
          const IconComponent = sec.ikon;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setSeksiAktif(sec.id);
                setSidebarMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                aktif
                  ? "bg-white text-indigo-700 shadow-md"
                  : "text-indigo-100 hover:bg-white/15 hover:text-white"
              }`}
            >
              <IconComponent className={`w-4 h-4 ${aktif ? "text-indigo-600" : "text-indigo-300"}`} />
              {sec.judul}
              {aktif && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500"></span>}
            </button>
          );
        })}
      </nav>
    </div>
  );

  /* ─────────────────────────────────── RENDER ─────────────────────────────── */
  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 40%, #f5f3ff 100%)" }}>

      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>N</div>
            <div>
              <span className="font-bold text-slate-800 text-sm">Niken Furniture</span>
              <span className="hidden sm:inline text-slate-400 text-xs ml-2">— Panel Administrasi</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarMobileOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
            >
              <PanelLeft className="w-3.5 h-3.5" /> Menu
            </button>
            <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sesi aktif
            </span>
            <button onClick={keluar} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </div>
      </header>

      {sidebarMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[1px]"
            onClick={() => setSidebarMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 z-50 h-full w-[86vw] max-w-[320px] p-4 bg-white shadow-2xl border-r border-slate-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-black tracking-wide text-slate-700 uppercase">Sidebar Menu</p>
                <p className="text-[11px] text-slate-500">Pilih menu pengelolaan data</p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarMobileOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Tutup sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderSidebarMenu()}
          </aside>
        </>
      )}

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">

        {/* ── SIDEBAR ── */}
        <aside className="hidden lg:block lg:sticky lg:top-20 h-fit">
          {renderSidebarMenu()}
        </aside>

        {/* ── KONTEN UTAMA ── */}
        <main className="space-y-5 min-w-0 pb-12">

          {/* JUDUL HALAMAN */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200/80">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{metaSeksi[seksiAktif].label}</h1>
              <p className="text-xs text-slate-500 mt-0.5">Tambah, ubah, atau hapus data {metaSeksi[seksiAktif].label}.</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${memuat ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-indigo-50 border-indigo-200 text-indigo-700"}`}>
              {memuat ? "Memuat…" : `${items.length} data`}
            </span>
          </div>

          {/* NOTIFIKASI */}
          {pesan && (
            <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${pesanWarna[pesan.tipe]}`} style={{ animation: "fadeIn .25s ease" }}>
              <span className="mt-0.5">
                {pesan.tipe === "sukses" ? "✅" : pesan.tipe === "error" ? "❌" : "ℹ️"}
              </span>
              <span>{pesan.teks}</span>
            </div>
          )}

          {/* KARTU FORMULIR */}
          <div ref={formRef} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            {/* Header kartu */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-indigo-600 bg-indigo-100 p-1.5 rounded-lg">
                {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
              <h2 className="font-semibold text-slate-800 text-sm">
                {editingId ? `Ubah Data — ID ${editingId}` : `Tambah Data Baru`}
              </h2>
            </div>

            {/* Grid form */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {fieldSeksi[seksiAktif].map((field) => {
                const label = labelField[seksiAktif]?.[field] ?? field.replace(/_/g, " ");
                const isTextarea = textareaFields.has(field);
                const isAktifField = field === "aktif";
                const isKategoriField = field === "category" && (seksiAktif === "services" || seksiAktif === "portfolio_items");
                const isImageField = field === "image" && (seksiAktif === "services" || seksiAktif === "portfolio_items");
                const isAktif = form[field] === "1" || form[field] === "true" || form[field] === true;
                const nilaiKategori = String(form[field] ?? "");
                const butuhOpsiKategoriSaatEdit = isKategoriField && nilaiKategori && nilaiKategori !== "__new__" && !opsiKategori.includes(nilaiKategori);
                const nilaiImage = String(form[field] ?? "");
                const sedangUnggahFieldIni = unggahField === field;
                const dragAktifFieldIni = dragFieldAktif === field;

                return (
                  <div key={field} className={`flex flex-col gap-1.5 ${isTextarea ? "sm:col-span-2 xl:col-span-3" : ""}`}>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
                    {isAktifField ? (
                      <div className="flex items-center h-10 gap-3 mt-1">
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, [field]: !isAktif }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${isAktif ? "bg-emerald-500" : "bg-slate-300"}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isAktif ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                        <span className={`text-sm font-semibold ${isAktif ? "text-emerald-600" : "text-slate-500"}`}>
                          {isAktif ? "Aktif (ON)" : "Non-aktif (OFF)"}
                        </span>
                      </div>
                    ) : isKategoriField ? (
                      <div className="space-y-2">
                        <select
                          value={nilaiKategori}
                          onChange={(e) => {
                            const value = e.target.value;
                            setForm((p) => ({ ...p, [field]: value }));
                            if (value !== "__new__") setKategoriBaru("");
                          }}
                          className="h-10 w-full border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 bg-slate-50 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-200"
                        >
                          <option value="">Pilih kategori…</option>
                          {butuhOpsiKategoriSaatEdit && <option value={nilaiKategori}>{nilaiKategori}</option>}
                          {opsiKategori.map((kategori) => (
                            <option key={kategori} value={kategori}>{kategori}</option>
                          ))}
                          <option value="__new__">+ Tambah kategori baru</option>
                        </select>

                        {nilaiKategori === "__new__" && (
                          <input
                            value={kategoriBaru}
                            onChange={(e) => setKategoriBaru(e.target.value)}
                            placeholder="Tulis nama kategori baru…"
                            className="h-10 w-full border border-indigo-200 rounded-xl px-3.5 text-sm text-slate-800 placeholder-slate-400 bg-indigo-50/40 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-200"
                          />
                        )}
                      </div>
                    ) : isImageField ? (
                      <div className="space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePilihGambar}
                          className="hidden"
                        />

                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (!dragAktifFieldIni) setDragFieldAktif(field);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setDragFieldAktif(null);
                          }}
                          onDrop={(e) => handleDropGambar(e, field)}
                          className={`rounded-xl border-2 border-dashed px-4 py-5 transition-all ${
                            dragAktifFieldIni
                              ? "border-indigo-400 bg-indigo-50"
                              : "border-slate-300 bg-slate-50"
                          }`}
                        >
                          <div className="flex flex-col items-center text-center gap-2">
                            {sedangUnggahFieldIni ? (
                              <Upload className="w-5 h-5 text-indigo-500 animate-bounce" />
                            ) : (
                              <ImagePlus className="w-5 h-5 text-indigo-500" />
                            )}
                            <p className="text-xs text-slate-600 font-medium">
                              {sedangUnggahFieldIni
                                ? "Sedang mengunggah gambar..."
                                : "Drag & drop gambar di sini, atau klik pilih file"}
                            </p>
                            <button
                              type="button"
                              onClick={() => pilihFileGambar(field)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" /> Pilih Gambar
                            </button>
                          </div>
                        </div>

                        <input
                          value={nilaiImage}
                          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                          placeholder="Atau masukkan path gambar manual..."
                          className="h-10 w-full border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 placeholder-slate-400 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200"
                        />

                        {nilaiImage && (
                          <div className="text-[11px] text-slate-500 break-all">
                            Path aktif: <span className="font-medium text-slate-700">{nilaiImage}</span>
                          </div>
                        )}
                      </div>
                    ) : isTextarea ? (
                      <textarea
                        rows={3}
                        value={form[field] ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                        placeholder={`Masukkan ${label.toLowerCase()}…`}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-200 resize-none"
                      />
                    ) : (
                      <input
                        value={form[field] ?? ""}
                        onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                        placeholder={`Masukkan ${label.toLowerCase()}…`}
                        className="h-10 w-full border border-slate-200 rounded-xl px-3.5 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all duration-200"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tombol aksi form */}
            <div className="flex flex-wrap items-center gap-2.5 px-6 py-4 bg-slate-50/70 border-t border-slate-100">
              <button onClick={simpanItem} className="inline-flex items-center gap-2 h-9 px-5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow hover:shadow-md active:scale-95"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                {editingId ? <><Save className="w-4 h-4" /> Simpan Perubahan</> : <><Plus className="w-4 h-4" /> Tambah Data</>}
              </button>
              {editingId && (
                <button onClick={batalEdit} className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all duration-200">
                  <X className="w-4 h-4" /> Batal
                </button>
              )}
              <button onClick={() => { setForm({}); setKategoriBaru(""); }} className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-all duration-200 ml-auto sm:ml-0">
                <Eraser className="w-4 h-4" /> Bersihkan
              </button>
            </div>
          </div>

          {/* KARTU TABEL */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100" style={{ background: "linear-gradient(90deg,#f8faff,#f3f4f6)" }}>
              <Grid className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-slate-700 text-sm">Pratinjau Data {metaSeksi[seksiAktif].label}</h2>
            </div>

            <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "65vh" }}>
              <table className="w-full text-left text-xs border-collapse" style={{ minWidth: "800px" }}>
                <thead className="sticky top-0 z-10 shadow-sm">
                  <tr style={{ background: "linear-gradient(90deg,#eef2ff,#f5f3ff)" }}>
                    {headerTabel[seksiAktif].map((judul, i) => (
                      <th key={i} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-500 border-b border-indigo-100 whitespace-nowrap">
                        {judul}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-500 border-b border-indigo-100 text-right whitespace-nowrap sticky right-0 bg-[#f5f3ff] z-20">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {memuat ? (
                    <tr>
                      <td colSpan={headerTabel[seksiAktif].length + 1} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                          <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                          <span className="text-sm">Sedang mengambil data…</span>
                        </div>
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={headerTabel[seksiAktif].length + 1} className="px-4 py-16 text-center">
                         <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Grid className="w-8 h-8 opacity-20" />
                            <span className="text-sm">Belum ada data yang tersedia di sistem.</span>
                         </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => renderBaris(item, idx))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
