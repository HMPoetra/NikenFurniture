"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  fadeUp,
  cardVariant,
  staggerContainer,
  viewport,
} from "@/lib/animations";
import { resolvePortfolioImage } from "@/lib/site";

type PortfolioItem = {
  id: number;
  category: string;
  title: string;
  location: string;
  year: string;
  image: string | null;
  description: string;
};

type PortfolioProps = {
  items: PortfolioItem[];
};

export default function Portfolio({ items }: PortfolioProps) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FFFCF7] pt-28 pb-16" id="portofolio">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          <div className="max-w-2xl">
            {/* Badge Portofolio */}
            <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full mb-6 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-600" />
              <span className="text-xs font-bold tracking-widest uppercase">Portofolio</span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Galeri Proyek & Mahakarya
            </h2>
            <p className="font-body text-slate-600 text-lg leading-relaxed">
              Kumpulan cerita dari klien yang telah mempercayakan ruangannya kepada kami.
              Bukan sekadar render 3D, ini adalah bukti nyata kualitas pengerjaan tim kami.
            </p>
          </div>

          <Link
            href="/portofolio"
            className="shrink-0 group inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-slate-800 border border-slate-300 bg-white hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm"
          >
            Lihat Semua Proyek
            <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          {items.slice(0, 6).map((item, index) => {
            const imagePath = resolvePortfolioImage(item.category, item.image);

            return (
              <motion.article
                key={item.id}
                variants={cardVariant}
                whileHover={{ y: -10 }}
                className={`group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
              >
                <div className={`relative w-full overflow-hidden ${index === 0 ? "h-[400px] md:h-[500px]" : "h-[450px]"}`}>
                  <Image
                    src={imagePath}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />

                  {/* Gradient Overlay: Diperhalus agar tetap estetis */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

                  {/* Content Over Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col justify-end h-full">
                    <div className="transform transition-all duration-500 group-hover:-translate-y-4">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] px-3 py-1 font-black uppercase tracking-widest rounded-full">
                          {item.category}
                        </span>
                        {item.year && (
                          <span className="text-primary-300 text-xs font-bold tracking-widest uppercase">{item.year}</span>
                        )}
                        {item.location && (
                          <span className="text-white/70 text-xs font-bold tracking-widest uppercase flex items-center before:content-['•'] before:mr-2 before:text-white/40">
                            {item.location}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-white font-bold text-2xl md:text-3xl leading-tight mb-3">
                        {item.title}
                      </h3>

                      <p className="text-slate-200 text-sm md:text-base font-body leading-relaxed line-clamp-2 md:line-clamp-3 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-32 transition-all duration-500 delay-100">
                        {item.description}
                      </p>
                    </div>

                    {/* Floating Button inside card */}
                    <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 hover:bg-primary-600 hover:border-primary-600">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-[2.5rem] mt-12 shadow-inner">
            <p className="text-slate-500 text-lg font-medium mb-2">Belum ada karya yang diunggah.</p>
            <p className="text-slate-400 text-sm">Segera tambahkan karya terbaik Anda melalui panel admin.</p>
          </div>
        )}
      </div>
    </section>
  );
}