"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  fadeUp,
  cardVariant,
  staggerContainer,
  viewport,
} from "@/lib/animations";

type ServicesProps = {
  services: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    features: string[];
    color: string;
    image: string | null;
    urutan?: number; // Ditambahkan agar tidak error di 0{service.urutan}
  }>;
};

// Merapikan warna kategori agar lebih soft di latar terang
const categoryColors: Record<string, { badge: string; dot: string; border: string; bg: string }> = {
  Konstruksi: {
    badge: "text-amber-700 bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
    border: "group-hover:border-amber-300",
    bg: "group-hover:bg-amber-50/50",
  },
  Renovasi: {
    badge: "text-stone-700 bg-stone-100 border-stone-200",
    dot: "bg-stone-500",
    border: "group-hover:border-stone-300",
    bg: "group-hover:bg-stone-50/50",
  },
  Interior: {
    badge: "text-rose-700 bg-rose-50 border-rose-200",
    dot: "bg-rose-500",
    border: "group-hover:border-rose-300",
    bg: "group-hover:bg-rose-50/50",
  },
  Desain: {
    badge: "text-violet-700 bg-violet-50 border-violet-200",
    dot: "bg-violet-500",
    border: "group-hover:border-violet-300",
    bg: "group-hover:bg-violet-50/50",
  },
};

const categories = ["Konstruksi", "Renovasi", "Interior", "Desain"];

export default function Services({ services }: ServicesProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FDF9F1]" id="layanan">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header Section */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full mb-6 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-600 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">Layanan Kami</span>
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Disiapkan untuk <span className="text-primary-600">dieksekusi</span>,<br className="hidden md:block" /> bukan sekadar wacana desain.
          </h2>
          <p className="font-body text-slate-600 max-w-2xl mx-auto leading-relaxed text-lg">
            Setiap layanan dirancang terstruktur agar Anda memahami hasil akhir yang kami berikan dari awal hingga tuntas.
          </p>
        </motion.div>

        {categories.map((category) => {
          const categoryServices = services.filter((service) => service.category === category);
          if (categoryServices.length === 0) return null;

          const colors = categoryColors[category] ?? {
            badge: "text-slate-700 bg-slate-100 border-slate-200",
            dot: "bg-slate-500",
            border: "group-hover:border-slate-300",
            bg: "group-hover:bg-slate-50",
          };

          return (
            <div key={category} className="mb-20">
              <div className="flex items-center gap-4 mb-10">
                <span className={`px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] font-body rounded-full border shadow-sm ${colors.badge}`}>
                  {category}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={staggerContainer}
              >
                {categoryServices.map((service, index) => (
                  <motion.article
                    key={service.id}
                    variants={cardVariant}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 ${colors.bg}`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <span className={`w-3.5 h-3.5 rounded-full ${colors.dot}`} />
                        </div>
                        <span className="text-sm font-black italic tracking-tighter text-slate-200 group-hover:text-slate-300 transition-colors">
                          0{service.urutan || index + 1}
                        </span>
                      </div>

                      <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                        {service.title}
                      </h3>

                      <p className="min-h-[80px] font-body text-slate-600 text-sm leading-relaxed mb-8">
                        {service.description}
                      </p>

                      <ul className="space-y-4 mb-10">
                        {service.features.slice(0, 3).map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                            <span className="mt-1.5 shrink-0 border-t-2 border-r-2 w-2 h-2 rotate-45 border-primary-500/50" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary-600 transition-colors">
                          Lihat Detail
                        </span>
                        <Link
                          href={`/layanan/${service.id}`}
                          className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-900 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white transition-all duration-300 shadow-sm"
                        >
                          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          );
        })}

        {/* Footer Link */}
        <motion.div
          className="text-center mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          <Link
            href="/layanan"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full font-bold text-slate-800 border border-slate-300 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm active:scale-95"
          >
            Eksplorasi Semua Layanan
          </Link>
        </motion.div>
      </div>
    </section>
  );
}