import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPortfolioItems } from "@/lib/content";
import { resolvePortfolioImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portofolio",
  description:
    "Kumpulan proyek pembangunan, renovasi, interior, dan desain yang telah dikerjakan Niken Furniture.",
};

export default async function PortofolioPage() {
  const items = await getPortfolioItems();
  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))];

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-12 shadow-2xl relative">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="relative max-w-4xl">
            <p className="section-subtitle text-indigo-200 mb-4">Lihat Semua Proyek</p>
            <h1 className="font-heading text-5xl md:text-6xl font-bold leading-[1.05] mb-6">
              Eksplorasi hasil proyek yang sudah kami realisasikan
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
              Jelajahi portofolio aktif dari berbagai kategori untuk melihat gaya
              desain, kualitas pengerjaan, dan pendekatan proyek yang kami
              jalankan.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 space-y-14">
        {categories.map((category) => {
          const groupedItems = items.filter((item) => item.category === category);

          if (groupedItems.length === 0) return null;

          return (
            <div key={category} className="space-y-6">
              <div>
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {category}
                </span>
                <h2 className="mt-4 font-heading text-3xl font-bold text-slate-900">
                  {category}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {groupedItems.map((item) => {
                  const imagePath = resolvePortfolioImage(item.category, item.image);

                  return (
                    <article
                      key={item.id}
                      className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-60">
                        <Image
                          src={imagePath}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/90">
                          {item.year && <span>{item.year}</span>}
                          {item.location && (
                            <span className="before:content-['•'] before:mr-2 before:text-white/50">
                              {item.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <h3 className="font-heading text-2xl font-bold text-slate-900 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                        <Link
                          href={`/portofolio/${item.id}`}
                          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 transition-colors hover:text-primary-500"
                        >
                          Lihat Detail Proyek
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Belum ada proyek aktif untuk ditampilkan.
          </div>
        )}
      </section>
    </main>
  );
}
