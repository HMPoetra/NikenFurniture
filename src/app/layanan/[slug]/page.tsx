import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyInfo, getServiceById, getServices } from "@/lib/content";
import { createWhatsAppHref } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const categoryMood: Record<string, { gradient: string; badge: string }> = {
  Konstruksi: {
    gradient: "from-amber-700 via-orange-600 to-yellow-500",
    badge: "bg-amber-100 text-amber-800",
  },
  Renovasi: {
    gradient: "from-stone-700 via-zinc-600 to-stone-400",
    badge: "bg-stone-100 text-stone-800",
  },
  Interior: {
    gradient: "from-rose-700 via-pink-600 to-fuchsia-500",
    badge: "bg-rose-100 text-rose-800",
  },
  Desain: {
    gradient: "from-violet-700 via-indigo-600 to-blue-500",
    badge: "bg-violet-100 text-violet-800",
  },
};

const processSteps = [
  "Brief awal dan identifikasi kebutuhan ruang",
  "Pengumpulan referensi, survey, atau pengukuran",
  "Penyusunan scope, material, dan urutan kerja",
  "Pelaksanaan produksi atau koordinasi lapangan",
  "Finishing, QC, dan follow-up setelah serah terima",
];

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceById(slug);

  if (!service) {
    return { title: "Layanan Tidak Ditemukan" };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function LayananDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [companyInfo, service, services] = await Promise.all([
    getCompanyInfo(),
    getServiceById(slug),
    getServices(),
  ]);

  if (!service) {
    notFound();
  }

  const related = services
    .filter((item) => item.category === service.category && item.id !== service.id)
    .slice(0, 3);
  const mood = categoryMood[service.category] || {
    gradient: service.color,
    badge: "bg-slate-100 text-slate-800",
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${mood.gradient} p-8 md:p-12 text-white shadow-2xl`}>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative max-w-4xl">
            <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
              <Link href="/" className="hover:text-white">Beranda</Link>
              <span>/</span>
              <Link href="/layanan" className="hover:text-white">Layanan</Link>
              <span>/</span>
              <span className="text-white/90">{service.title}</span>
            </nav>

            <span className={`inline-flex rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${mood.badge}`}>
              {service.category}
            </span>
            <h1 className="mt-6 font-heading text-5xl md:text-6xl font-bold leading-[1.05]">
              {service.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
              {service.description}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#ringkasan" className="btn-primary text-center border-white bg-white text-slate-900 hover:bg-slate-100 hover:border-slate-100">
                Lihat Ringkasan
              </a>
              <a
                href={createWhatsAppHref(
                  companyInfo.phone,
                  `Halo ${companyInfo.name}, saya ingin konsultasi untuk layanan ${service.title}.`,
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

      <section id="ringkasan" className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-8">
        <div className="space-y-8">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Yang termasuk di layanan ini</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {service.features.map((feature, index) => (
                <div key={feature} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-transform duration-300 hover:-translate-y-0.5">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-500">
                    Poin 0{index + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Alur kerja umum</h2>
            <div className="grid gap-4 md:grid-cols-5">
              {processSteps.map((step, index) => (
                <div key={step} className="rounded-2xl bg-slate-50 p-4 border border-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="font-heading text-3xl text-primary-600 mb-2">0{index + 1}</div>
                  <p className="text-sm leading-relaxed text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 mb-3">Kategori</div>
            <div className="text-2xl font-heading text-slate-900 mb-4">{service.category}</div>
            <p className="text-sm leading-relaxed text-slate-500 mb-6">
              Detail ini disusun untuk membantu pengunjung memahami konteks pekerjaan dan jalur konsultasi yang relevan.
            </p>
            <a href="/#kontak" className="btn-primary inline-flex w-full justify-center">
              Turun ke Kontak
            </a>
          </div>

          {related.length > 0 && (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-4">Layanan terkait</h2>
              <div className="space-y-3">
                {related.map((item) => (
                  <Link key={item.id} href={`/layanan/${item.id}`} className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:border-primary-200 hover:bg-primary-50/40">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400 mb-1">{item.category}</div>
                    <div className="font-heading text-lg font-semibold text-slate-900">{item.title}</div>
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
