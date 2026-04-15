"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import {
  fadeUp,
  fadeLeft,
  fadeRight,
  cardVariant,
  staggerContainer,
  viewport,
} from "@/lib/animations";
import type { CompanyInfo } from "@/lib/site";

type ExperienceProps = {
  experiences: Array<{ year: string; title: string; description: string }>;
  testimonials: Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
  }>;
  company?: CompanyInfo;
};

const fallbackCompany: CompanyInfo = {
  name: "Niken Furniture",
  tagline: "Membangun Ruang, Merangkai Mimpi",
  description:
    "Niken Furniture adalah perusahaan profesional yang bergerak di bidang furniture custom, kontraktor bangunan, serta desain dan interior untuk hunian dan ruang usaha.",
  address: "",
  phone: "",
  email: "",
  instagram: "",
  facebook: "",
  youtube: "",
  mapsEmbed: "",
  founded: "2010",
  projects: "0",
  clients: "0",
  team: "0",
};

export default function Experience({
  experiences,
  testimonials,
  company,
}: ExperienceProps) {
  const companyData = company ?? fallbackCompany;
  const yearsActive = Math.max(new Date().getFullYear() - Number(companyData.founded || 0), 0);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FDF9F1]" id="pengalaman">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Header Timeline ── */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full mb-6 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-600" />
            <span className="text-xs font-bold tracking-widest uppercase">Perjalanan Kami</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            {yearsActive} Tahun Membangun Kepercayaan
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Sejak {companyData.founded}, {companyData.name} telah menyelesaikan {companyData.projects} proyek untuk {companyData.clients} klien dengan dukungan {companyData.team} anggota tim.
          </p>
        </motion.div>

        {/* ── Timeline Jejak Historis ── */}
        <div className="relative mb-40 max-w-5xl mx-auto">
          {/* Garis Tengah Timeline */}
          <motion.div
            className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-0.5
                       bg-gradient-to-b from-slate-200 via-primary-200 to-slate-200
                       -translate-x-1/2 origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <div className="space-y-20">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={i % 2 === 0 ? fadeLeft : fadeRight}
                className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
              >
                {/* Node Timeline */}
                <div className="absolute left-[28px] md:left-1/2 top-0 w-6 h-6 rounded-full
                               bg-white border-4 border-primary-600 shadow-md
                               -translate-x-1/2 z-10" />

                {/* Kartu Konten Timeline */}
                <div className={`md:w-1/2 pl-16 md:pl-0 ${i % 2 === 0 ? "md:pr-20 md:text-right" : "md:pl-20"
                  }`}>
                  <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500 group">
                    <span className="inline-block font-heading text-primary-600 text-3xl md:text-4xl font-black mb-4 tracking-tighter">
                      {exp.year}
                    </span>
                    <h3 className="font-heading text-slate-900 text-xl md:text-2xl font-bold mb-3">
                      {exp.title}
                    </h3>
                    <p className="font-body text-slate-600 leading-relaxed text-sm md:text-base">
                      {exp.description}
                    </p>
                  </div>
                </div>

                <div className="md:w-1/2 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Testimonials Header ── */}
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
        >
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full mb-6 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-500" />
            <span className="text-xs font-bold tracking-widest uppercase">Testimoni</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6">Apa Kata Klien Kami</h2>
        </motion.div>

        {/* ── Testimonials Grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              whileHover={{ y: -12 }}
              className="relative bg-white border border-slate-100 shadow-sm p-10 rounded-[2.5rem] hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group"
            >
              {/* Kutipan Ikon (Quote) */}
              <div className="absolute top-10 right-10 text-slate-50 group-hover:text-primary-50 transition-colors duration-500">
                <Quote className="w-14 h-14 fill-current" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Rating Bintang */}
                <div className="flex gap-1 mb-8">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${j < t.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"
                        }`}
                    />
                  ))}
                </div>

                <p className="font-body text-slate-700 leading-relaxed italic mb-10 text-sm md:text-base flex-grow">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-heading font-black text-xl border-2 border-white shadow-sm overflow-hidden">
                    <span className="bg-gradient-to-br from-primary-600 to-primary-400 text-transparent bg-clip-text">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-slate-900">
                      {t.name}
                    </div>
                    <div className="font-body text-primary-600 text-xs mt-1 uppercase tracking-widest font-bold">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}