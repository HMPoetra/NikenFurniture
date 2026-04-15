import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Daftar layanan pembangunan, renovasi, interior custom, dan desain dari Niken Furniture.",
};

const categoryDescriptions: Record<string, string> = {
  Konstruksi:
    "Pekerjaan pembangunan dari nol, penambahan area, sampai proyek yang memerlukan koordinasi lapangan penuh.",
  Renovasi:
    "Peremajaan ruang dan bangunan agar fungsi, alur, dan tampilannya naik kelas tanpa kehilangan konteks kebutuhan Anda.",
  Interior:
    "Furniture custom, kabinet built-in, penataan ruang, dan penyempurnaan detail interior yang lebih rapi dan terarah.",
  Desain:
    "Visualisasi konsep, gambar awal, dan arahan desain untuk membantu keputusan sebelum eksekusi dimulai.",
};

const categoryAccent: Record<string, string> = {
  Konstruksi: "from-amber-700 to-orange-500",
  Renovasi: "from-stone-700 to-zinc-500",
  Interior: "from-rose-700 to-pink-500",
  Desain: "from-violet-700 to-indigo-500",
};

export default async function LayananPage() {
  const services = await getServices();
  const categories = ["Konstruksi", "Renovasi", "Interior", "Desain"];

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-12 shadow-2xl relative">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
          <div className="relative max-w-4xl">
            <p className="section-subtitle text-indigo-200 mb-4">Layanan Detail</p>
            <h1 className="font-heading text-5xl md:text-6xl font-bold leading-[1.05] mb-6">
              Pilih layanan yang paling dekat dengan kebutuhan proyek Anda
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
              Halaman ini merangkum semua layanan aktif dan menyediakan jalur ke
              halaman detail tiap layanan agar pengunjung bisa membaca cakupan,
              output, dan langkah berikutnya dengan lebih jelas.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 space-y-14">
        {categories.map((category) => {
          const items = services.filter((service) => service.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    {category}
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-bold text-slate-900">{category}</h2>
                  <p className="mt-2 max-w-3xl text-slate-500 leading-relaxed">
                    {categoryDescriptions[category]}
                  </p>
                </div>
                <Link href="/#kontak" className="btn-primary text-center">
                  Konsultasi Gratis
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((service) => (
                  <article key={service.id} className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                    <div className={`relative h-44 bg-gradient-to-br ${categoryAccent[category] || service.color}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.22))]" />
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/70">
                          Detail layanan
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-white">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="min-h-[72px] text-sm leading-relaxed text-slate-500 mb-5">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mb-6 text-sm text-slate-600">
                        {service.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={`/layanan/${service.id}`} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 transition-colors hover:text-primary-500">
                        Lihat Detail Lainnya
                        <span>{"->"}</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
