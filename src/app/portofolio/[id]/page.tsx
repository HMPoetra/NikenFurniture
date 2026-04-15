import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCompanyInfo,
  getPortfolioItemById,
  getPortfolioItems,
} from "@/lib/content";
import { createWhatsAppHref, resolvePortfolioImage } from "@/lib/site";

type PageProps = {
  params: Promise<{ id: string }>;
};

const categoryMood: Record<string, string> = {
  "Pembangunan Rumah": "from-amber-700 via-orange-600 to-yellow-500",
  "Renovasi Rumah": "from-stone-700 via-zinc-600 to-stone-400",
  "Interior Ruangan": "from-rose-700 via-pink-600 to-fuchsia-500",
  "Kitchen Set": "from-indigo-700 via-blue-600 to-sky-500",
  Desain: "from-violet-700 via-indigo-600 to-blue-500",
};

export async function generateStaticParams() {
  const items = await getPortfolioItems();
  return items.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getPortfolioItemById(id);

  if (!item) {
    return { title: "Proyek Tidak Ditemukan" };
  }

  return {
    title: item.title,
    description: item.description || `Detail proyek ${item.title}`,
  };
}

export default async function PortofolioDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [companyInfo, item, allItems] = await Promise.all([
    getCompanyInfo(),
    getPortfolioItemById(id),
    getPortfolioItems(),
  ]);

  if (!item) {
    notFound();
  }

  const related = allItems
    .filter((current) => current.category === item.category && current.id !== item.id)
    .slice(0, 3);
  const mood = categoryMood[item.category] || "from-slate-800 via-slate-700 to-slate-600";
  const imagePath = resolvePortfolioImage(item.category, item.image);

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div
          className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${mood} p-8 md:p-12 text-white shadow-2xl`}
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-4xl">
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <span>/</span>
              <Link href="/portofolio" className="hover:text-white">Portofolio</Link>
              <span>/</span>
              <span className="text-white/90">{item.title}</span>
            </nav>

            <span className="inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              {item.category}
            </span>
            <h1 className="mt-6 font-heading text-5xl md:text-6xl font-bold leading-[1.05]">
              {item.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
              {item.description || "Detail proyek ini sedang dalam proses kurasi deskripsi."}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#ringkasan"
                className="btn-primary text-center border-white bg-white text-slate-900 hover:bg-slate-100 hover:border-slate-100"
              >
                Lihat Ringkasan Proyek
              </a>
              <a
                href={createWhatsAppHref(
                  companyInfo.phone,
                  `Halo ${companyInfo.name}, saya tertarik dengan proyek ${item.title}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-center border-white text-white hover:bg-white hover:text-slate-900"
              >
                Konsultasi via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="ringkasan"
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8"
      >
        <div className="space-y-8">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-5">
              Visual Proyek
            </h2>
            <div className="relative h-[340px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-100">
              <Image
                src={imagePath}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">
              Ringkasan Detail
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Proyek ini termasuk kategori {item.category} dan dikerjakan dengan pendekatan
              terstruktur untuk menjaga kualitas hasil akhir, ketepatan timeline,
              serta kenyamanan pemilik ruang.
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">
              Informasi Proyek
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">Kategori</div>
                <div className="text-slate-800 font-medium">{item.category || "-"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">Lokasi</div>
                <div className="text-slate-800 font-medium">{item.location || "-"}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">Tahun</div>
                <div className="text-slate-800 font-medium">{item.year || "-"}</div>
              </div>
            </div>

            <a href="/#kontak" className="btn-primary inline-flex w-full justify-center mt-6">
              Mulai Proyek Serupa
            </a>
          </div>

          {related.length > 0 && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">
                Proyek Terkait
              </h2>
              <div className="space-y-3">
                {related.map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/portofolio/${relatedItem.id}`}
                    className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:border-primary-200 hover:bg-primary-50/40"
                  >
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400 mb-1">
                      {relatedItem.category}
                    </div>
                    <div className="font-heading text-lg font-semibold text-slate-900">
                      {relatedItem.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
