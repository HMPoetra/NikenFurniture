import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCompanyInfo,
  getPortfolioItemById,
  getPortfolioItems,
} from "@/lib/content";
import { createWhatsAppHref, resolvePortfolioImage } from "@/lib/site";
import PortfolioMediaShowcase from "@/components/PortfolioMediaShowcase";

type PageProps = {
  params: Promise<{ id: string }>;
};

const categoryMood: Record<string, { gradient: string }> = {
  "Pembangunan Rumah": { gradient: "from-amber-700 via-orange-600 to-yellow-500" },
  "Renovasi Rumah": { gradient: "from-stone-700 via-zinc-600 to-stone-400" },
  "Interior Ruangan": { gradient: "from-rose-700 via-pink-600 to-fuchsia-500" },
  "Kitchen Set": { gradient: "from-indigo-700 via-blue-600 to-sky-500" },
  Desain: { gradient: "from-violet-700 via-indigo-600 to-blue-500" },
};

type MediaItem = {
  id: number;
  url: string;
  fileType: "image" | "video";
  fileName?: string | null;
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

  const mood = categoryMood[item.category] || { gradient: "from-slate-800 via-slate-700 to-slate-600" };
  const heroImage = resolvePortfolioImage(item.category, item.image);
  const mediaItems: MediaItem[] = Array.isArray((item as any).media)
    ? (item as any).media
        .map((entry: any) => ({
          id: Number(entry?.id || 0),
          url: String(entry?.url || "").trim(),
          fileType: entry?.fileType === "video" ? "video" : "image",
          fileName: entry?.fileName || null,
        }))
        .filter((entry: MediaItem) => Boolean(entry.url))
    : [];

  const showcaseMedia = mediaItems.length > 0 ? mediaItems : [{ id: 0, url: heroImage, fileType: "image" as const }];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(248,250,252,1)_35%,_rgba(241,245,249,1)_100%)] pt-32 pb-20">
      <section className="relative mx-auto mb-12 max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-white/60 bg-slate-950 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.55)]">
          <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-95`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative px-6 py-10 md:px-10 lg:px-12 lg:py-12">
            <div className="flex h-full max-w-4xl flex-col justify-between">
              <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/70">
                <Link href="/" className="transition-colors hover:text-white">Beranda</Link>
                <span>/</span>
                <Link href="/portofolio" className="transition-colors hover:text-white">Portofolio</Link>
                <span>/</span>
                <span className="text-white/90">{item.title}</span>
              </nav>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-white" />
                {item.category}
              </div>

              <h1 className="mt-6 max-w-2xl font-heading text-4xl leading-[1.02] md:text-6xl lg:text-7xl">
                {item.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/82 md:text-lg">
                {item.description || "Detail proyek ini sedang dalam proses kurasi deskripsi."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#ringkasan"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Lihat Ringkasan
                </a>
                <a
                  href={createWhatsAppHref(
                    companyInfo.phone,
                    `Halo ${companyInfo.name}, saya tertarik dengan proyek ${item.title}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Konsultasi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ringkasan" className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.85fr)]">
          <div className="space-y-8">
            <PortfolioMediaShowcase title={item.title} media={showcaseMedia} />

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Kategori", value: item.category || "-" },
                { label: "Lokasi", value: item.location || "-" },
                { label: "Tahun", value: item.year || "-" },
                { label: "Media", value: `${mediaItems.length} item` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">{stat.label}</div>
                  <div className="mt-3 font-heading text-xl font-bold text-slate-900">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">Ringkasan Detail</h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                {item.description || "Ringkasan proyek belum tersedia pada database."}
              </p>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className={`h-2 bg-gradient-to-r ${mood.gradient}`} />
              <div className="p-6">
                <h2 className="font-heading text-2xl font-bold text-slate-900">Informasi Proyek</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Ringkasan cepat untuk membantu pengunjung memahami konteks pekerjaan dan jalur konsultasi.
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  {[
                    { label: "Kategori", value: item.category || "-" },
                    { label: "Lokasi", value: item.location || "-" },
                    { label: "Tahun", value: item.year || "-" },
                  ].map((entry) => (
                    <div key={entry.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{entry.label}</div>
                      <div className="mt-1 text-base font-semibold text-slate-900">{entry.value}</div>
                    </div>
                  ))}
                </div>

                <a href="/#kontak" className="btn-primary mt-6 inline-flex w-full justify-center">
                  Mulai Proyek Serupa
                </a>
              </div>
            </div>

            {related.length > 0 && (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-heading text-2xl font-bold text-slate-900">Proyek Terkait</h2>
                <div className="mt-5 space-y-3">
                  {related.map((relatedItem) => (
                    <Link
                      key={relatedItem.id}
                      href={`/portofolio/${relatedItem.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:border-primary-200 hover:bg-primary-50/50"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${categoryMood[relatedItem.category]?.gradient || "from-slate-700 to-slate-500"} text-white shadow-sm`}>
                        <span className="text-sm font-bold uppercase">{String(relatedItem.title).slice(0, 1)}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{relatedItem.category}</div>
                        <div className="mt-1 truncate font-heading text-lg font-semibold text-slate-900 transition-colors group-hover:text-primary-600">
                          {relatedItem.title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
