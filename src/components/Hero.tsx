"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2, Ruler, Sofa, Star } from "lucide-react";
import {
  fadeUp,
  staggerSlow,
  staggerContainer,
  cardVariant,
} from "@/lib/animations";
import type { CompanyInfo } from "@/lib/site";

type HeroProps = {
  data: CompanyInfo;
};

export default function Hero({ data }: HeroProps) {
  const stats = [
    { value: data.projects, label: "Proyek Selesai", icon: Building2 },
    { value: data.clients, label: "Klien Aktif", icon: Sofa },
    { value: data.team, label: "Tim Profesional", icon: Ruler },
    { value: `${new Date().getFullYear() - Number(data.founded)}+`, label: "Tahun Pengalaman", icon: Sparkles },
  ];

  return (
    // SECTIONS: Background diubah menjadi Krem lembut (#FDF9F1)
    <section className="relative min-h-[92vh] md:min-h-[100vh] flex flex-col justify-center overflow-hidden bg-[#FDF9F1] pt-24 sm:pt-28 pb-14 sm:pb-16">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">

          {/* Kiri: Teks Konten */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerSlow}
          >
            {/* Badge Atas: Disesuaikan untuk latar terang */}
            <motion.div variants={fadeUp} className="inline-flex items-center justify-center lg:justify-start space-x-2 bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 px-5 py-2 rounded-full mb-8 lg:w-max mx-auto lg:mx-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium tracking-wide">{data.tagline}</span>
            </motion.div>

            {/* Judul Utama: Warna teks diubah menjadi gelap (slate-900) */}
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.15] mb-6"
            >
              Membangun <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">Ruang</span><br />
              bersama <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-orange-400">{data.name}</span>
            </motion.h1>

            {/* Deskripsi: Warna teks diubah menjadi abu-abu gelap (slate-700) */}
            <motion.p
              variants={fadeUp}
              className="font-body text-slate-700 text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0"
            >
              {data.description}
            </motion.p>

            {/* Tombol Aksi */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link href="#layanan" className="group relative w-full sm:w-auto inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-full font-semibold overflow-hidden transition-all duration-300 hover:bg-primary-500 hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/20">
                <span className="relative z-10 tracking-wide">Mulai Proyek Anda</span>
                <ArrowRight className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              {/* Tombol Outline: Disesuaikan untuk latar terang */}
              <Link href="#portofolio" className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-slate-800 border border-slate-300 bg-white hover:bg-slate-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">
                Lihat Karya Kami
              </Link>
            </motion.div>
          </motion.div>

          {/* Kanan: Bingkai Interaktif (Interactive Frame) */}
          <motion.div
            className="lg:col-span-5 relative md:h-[420px] lg:h-[560px] xl:h-[600px] w-full mt-8 lg:mt-0 group hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ perspective: 1200 }}
          >
            {/* Foto Utama: Tetap sama, hanya border yang disesuaikan sedikit */}
            <motion.div
              className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-white"
              whileHover={{ rotateY: -6, rotateX: 3, scale: 1.02, z: 20 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
                alt="Premium Interior Design"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              {/* Overlay gradasi tipis di bawah foto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </motion.div>

            {/* Elemen Melayang 1 (Top-Right): Disesuaikan latar terang */}
            <motion.div
              className="absolute top-8 lg:top-10 -right-3 lg:-right-8 bg-white/80 backdrop-blur-lg border border-slate-100 p-3 lg:p-4 rounded-2xl shadow-xl z-30 flex items-center gap-3 lg:gap-4"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center shadow-inner border border-secondary-200">
                <Building2 className="text-secondary-600 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-950 font-bold text-lg lg:text-xl">{data.projects}</h4>
                <p className="text-slate-600 text-[11px] lg:text-xs font-medium uppercase tracking-wider">Proyek Terselesaikan</p>
              </div>
            </motion.div>

            {/* Elemen Melayang 2 (Bottom-Left): Disesuaikan latar terang */}
            <motion.div
              className="absolute bottom-10 lg:bottom-16 -left-4 lg:-left-12 bg-white/80 backdrop-blur-lg border border-slate-100 p-3 lg:p-4 rounded-2xl shadow-xl z-30 flex items-center gap-3 lg:gap-4"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div>
                <p className="text-slate-800 font-semibold text-sm">Review</p>
                <div className="flex text-yellow-500 gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Stats Interaktif di Bawah */}
        <motion.div
          className="mt-20 sm:mt-28 z-10 relative"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={cardVariant}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white border border-slate-100 p-5 sm:p-6 md:p-8 rounded-3xl group transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/5 cursor-default overflow-hidden relative"
                >
                  <div className="relative z-10">
                    {/* Icon Container: Latar belakang icon disesuaikan */}
                    <div className="bg-primary-50 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-primary-600 transition-colors duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600 group-hover:scale-110 group-hover:text-white transition-all duration-300" />
                    </div>
                    {/* Angka & Label: Warna teks diubah menjadi gelap */}
                    <h3 className="font-heading text-4xl md:text-5xl font-bold text-slate-950 mb-3 tracking-tight">{stat.value}</h3>
                    <p className="font-body text-slate-600 text-sm md:text-base uppercase tracking-widest font-semibold">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}