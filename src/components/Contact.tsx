"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Send, Facebook, Youtube } from "lucide-react";
import type { CompanyInfo } from "@/lib/site";
import {
  createFacebookHref,
  createInstagramHref,
  createMailHref,
  createMapsSearchHref,
  createYoutubeHref,
  createWhatsAppHref,
} from "@/lib/site";

type ContactProps = {
  data: CompanyInfo;
  services: Array<{ id: string; title: string }>;
};

type FormData = {
  nama: string;
  telepon: string;
  email: string;
  layanan: string;
  lokasi: string;
  budget: string;
  pesan: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

const budgetOptions = [
  { value: "", label: "-- Estimasi Budget --" },
  { value: "< 50jt", label: "Di bawah Rp 50 Juta" },
  { value: "50-150jt", label: "Rp 50 Juta - Rp 150 Juta" },
  { value: "150-500jt", label: "Rp 150 Juta - Rp 500 Juta" },
  { value: "500jt-1M", label: "Rp 500 Juta - Rp 1 Miliar" },
  { value: "> 1M", label: "Di atas Rp 1 Miliar" },
];

function ContactCard({
  title,
  value,
  helper,
  href,
  icon: Icon,
}: {
  title: string;
  value: string;
  helper: string;
  href?: string;
  icon: React.ElementType;
}) {
  const content = (
    <div className="group flex h-full items-start gap-4 bg-white border border-slate-100 hover:border-primary-200 p-5 transition-all duration-300 rounded-[1.25rem] shadow-sm hover:shadow-md">
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:border-primary-600 transition-all duration-300">
        <Icon className="w-5 h-5 text-primary-600 group-hover:text-white" />
      </div>
      <div className="min-w-0">
        <div className="font-body text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">
          {title}
        </div>
        <div className="font-heading text-slate-900 text-base font-bold break-words mb-1">
          {value}
        </div>
        <div className="font-body text-slate-400 text-xs">
          {helper}
        </div>
      </div>
    </div>
  );

  if (!href) return content;
  return <a href={href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>;
}

export default function Contact({ data, services }: ContactProps) {
  const layananOptions = [
    { value: "", label: "-- Pilih Jenis Layanan --" },
    ...services.map((s) => ({ value: s.id, label: s.title })),
  ];

  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormData>({
    nama: "",
    telepon: "",
    email: "",
    layanan: "",
    lokasi: "",
    budget: "",
    pesan: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [apiMessage, setApiMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<FormData> = {};

    if (!form.nama.trim()) nextErrors.nama = "Nama wajib diisi";
    if (!form.telepon.trim()) {
      nextErrors.telepon = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9+\-\s]{8,15}$/.test(form.telepon)) {
      nextErrors.telepon = "Format nomor belum valid";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Format email belum valid";
    }
    if (!form.layanan) nextErrors.layanan = "Pilih layanan yang dibutuhkan";
    if (!form.pesan.trim()) {
      nextErrors.pesan = "Ceritakan kebutuhan proyek Anda";
    } else if (form.pesan.trim().length < 20) {
      nextErrors.pesan = "Deskripsi proyek minimal 20 karakter";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setApiMessage("");

    try {
      const response = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setApiMessage(result.message || "Pesan berhasil dikirim.");
        setForm({
          nama: "", telepon: "", email: "", layanan: "", lokasi: "", budget: "", pesan: "",
        });
        formRef.current?.reset();
        return;
      }

      setStatus("error");
      setApiMessage(result.message || "Terjadi kesalahan saat mengirim pesan.");
    } catch {
      setStatus("error");
      setApiMessage("Koneksi gagal. Silakan coba lagi beberapa saat.");
    }
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FFFCF7] border-t border-slate-100" id="kontak">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-72px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full mb-6 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase">Hubungi Kami</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                Langkah pertama menuju <span className="text-primary-600">{data.tagline.toLowerCase()}.</span>
              </h2>
              <p className="font-body text-slate-600 text-lg leading-relaxed">
                Form ini cocok untuk kebutuhan estimasi awal, diskusi spesifikasi material,
                panggilan survey, atau kolaborasi B2B.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Kolom Kiri: Detil Kontak */}
          <motion.div
            className="lg:col-span-5 flex flex-col gap-6"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            {/* Call to Action Utama */}
            <motion.div
              className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 relative overflow-hidden rounded-[2.5rem] shadow-xl text-white group"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute -top-10 -right-10 opacity-10 transform rotate-12 group-hover:scale-125 transition-transform duration-700">
                <Phone className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <div className="font-heading text-white text-2xl font-bold mb-3">
                  Konsultasi Kilat
                </div>
                <p className="font-body text-white/90 leading-relaxed mb-8 text-sm">
                  Perlu arahan cepat? Hubungi tim kami langsung via WhatsApp untuk respon yang lebih instan.
                </p>
                <a
                  href={createWhatsAppHref(data.phone, `Halo tim ${data.name}, saya ingin konsultasi proyek.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-white text-primary-700 px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-slate-50 transition-all shadow-lg active:scale-95"
                >
                  Chat ke WhatsApp
                </a>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                <h4 className="font-heading text-slate-900 font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary-600 rounded-full" />
                  Informasi Kontak
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ContactCard title="Alamat Studio" value={data.address} helper="Survey lokasi tersedia sesuai jadwal" href={createMapsSearchHref(data.address)} icon={MapPin} />
                  <ContactCard title="Telepon" value={data.phone} helper="Respon cepat pada jam kerja" href={createWhatsAppHref(data.phone)} icon={Phone} />
                  <ContactCard title="Email Perusahaan" value={data.email} helper="Untuk brief proyek dan dokumen B2B" href={createMailHref(data.email)} icon={Mail} />
                  <ContactCard title="Instagram" value={data.instagram} helper="Lihat progres proyek terbaru" href={createInstagramHref(data.instagram)} icon={Instagram} />
                  <ContactCard title="Facebook" value={data.facebook} helper="Pembaruan dan dokumentasi proyek" href={createFacebookHref(data.facebook)} icon={Facebook} />
                  <ContactCard title="YouTube" value={data.youtube} helper="Konten proses dan hasil kerja" href={createYoutubeHref(data.youtube)} icon={Youtube} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
              <h4 className="font-heading text-slate-900 font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary-600 rounded-full" />
                Jam Operasional
              </h4>
              <div className="space-y-4 font-body text-sm text-slate-600">
                <div className="flex justify-between border-b border-slate-50 pb-4"><span>Senin - Jumat</span><span className="text-slate-900 font-bold">08.00 - 17.00 WIB</span></div>
                <div className="flex justify-between border-b border-slate-50 pb-4"><span>Sabtu</span><span className="text-slate-900 font-bold">08.00 - 14.00 WIB</span></div>
                <div className="flex justify-between pt-1"><span>Minggu / Hari Libur</span><span className="text-primary-600 font-black uppercase text-[10px] tracking-widest">Tutup</span></div>
              </div>
            </div>
          </motion.div>

          {/* Kolom Kanan: Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          >
            <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-xl">
              <div className="mb-10">
                <h3 className="font-heading text-slate-900 text-3xl font-bold mb-3 flex items-center gap-3">
                  Kirim Brief Proyek <Send className="w-6 h-6 text-primary-600" />
                </h3>
                <p className="font-body text-slate-500 text-base leading-relaxed">
                  Harap sertakan informasi sedetail mungkin agar kami dapat memberikan solusi yang paling tepat.
                </p>
              </div>

              {status !== "idle" && (
                <div className={`mb-8 p-6 rounded-2xl text-sm font-bold border transition-all ${status === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                  {apiMessage}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nama" className="block font-body text-slate-700 text-xs font-black uppercase tracking-widest mb-3">Nama Lengkap *</label>
                    <input id="nama" name="nama" value={form.nama} onChange={handleChange} placeholder="Budi Santoso" className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-body text-sm px-5 py-4 placeholder:text-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm" />
                    {errors.nama && <p className="mt-2 text-rose-600 text-xs font-bold">{errors.nama}</p>}
                  </div>
                  <div>
                    <label htmlFor="telepon" className="block font-body text-slate-700 text-xs font-black uppercase tracking-widest mb-3">No. WhatsApp *</label>
                    <input id="telepon" name="telepon" value={form.telepon} onChange={handleChange} placeholder="0812xxxxxx" className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-body text-sm px-5 py-4 placeholder:text-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm" />
                    {errors.telepon && <p className="mt-2 text-rose-600 text-xs font-bold">{errors.telepon}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block font-body text-slate-700 text-xs font-black uppercase tracking-widest mb-3">Alamat Email</label>
                    <input id="email" name="email" value={form.email} onChange={handleChange} placeholder="email@perusahaan.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-body text-sm px-5 py-4 placeholder:text-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm" />
                    {errors.email && <p className="mt-2 text-rose-600 text-xs font-bold">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="lokasi" className="block font-body text-slate-700 text-xs font-black uppercase tracking-widest mb-3">Lokasi Proyek</label>
                    <input id="lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} placeholder="Contoh: BSD City" className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-body text-sm px-5 py-4 placeholder:text-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="layanan" className="block font-body text-slate-700 text-xs font-black uppercase tracking-widest mb-3">Jenis Layanan *</label>
                    <select id="layanan" name="layanan" value={form.layanan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-body text-sm px-5 py-4 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm appearance-none cursor-pointer">
                      {layananOptions.map((option) => (
                        <option key={option.value || option.label} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.layanan && <p className="mt-2 text-rose-600 text-xs font-bold">{errors.layanan}</p>}
                  </div>
                  <div>
                    <label htmlFor="budget" className="block font-body text-slate-700 text-xs font-black uppercase tracking-widest mb-3">Estimasi Budget</label>
                    <select id="budget" name="budget" value={form.budget} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-body text-sm px-5 py-4 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm appearance-none cursor-pointer">
                      {budgetOptions.map((option) => (
                        <option key={option.value || option.label} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="pesan" className="block font-body text-slate-700 text-xs font-black uppercase tracking-widest mb-3">Ceritakan Singkat Rencana Anda *</label>
                  <textarea id="pesan" name="pesan" rows={5} value={form.pesan} onChange={handleChange} placeholder="Ukuran ruang, gaya desain yang diinginkan, dll..." className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-body text-sm px-5 py-4 placeholder:text-slate-400 resize-none focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 transition-all shadow-sm" />
                  <div className="flex justify-between items-center mt-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-rose-600">{errors.pesan || ""}</span>
                    <span className={form.pesan.length < 20 ? "text-slate-400" : "text-primary-600"}>{form.pesan.length} karakter</span>
                  </div>
                </div>

                <p className="font-body text-slate-400 text-[10px] leading-relaxed italic">
                  * Data Anda aman. Kami hanya menggunakan informasi ini untuk keperluan konsultasi proyek Anda.
                </p>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={`w-full py-5 rounded-2xl font-body font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg ${status === "loading"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-1 active:scale-[0.98] shadow-primary-500/20"
                    }`}
                >
                  {status === "loading" ? "Sedang Mengirim..." : "Kirim Pengajuan Proyek"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}