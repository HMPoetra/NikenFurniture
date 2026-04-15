"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  fadeLeft,
  fadeRight,
  cardVariant,
  staggerContainer,
  viewport,
} from "@/lib/animations";

type AboutProps = {
  data: {
    description: string;
    founded: string;
  };
};

const values = [
  {
    title: "Tim Lintas Disiplin",
    desc: "Arsitek, drafter, tukang produksi, dan pengawas lapangan bekerja dalam satu alur terpadu.",
  },
  {
    title: "Pekerjaan Terukur",
    desc: "Timeline, desain, dan progres dipaparkan secara transparan di setiap tahap.",
  },
  {
    title: "Furnitur Custom Presisi",
    desc: "Setiap potongan kayu dan material dioptimalkan sesuai dengan proporsi ruangan.",
  },
  {
    title: "Dukungan Purna Jual",
    desc: "Komitmen kami tidak berhenti saat serah terima. Kami siap membantu kelanjutan proyek Anda.",
  },
];

const steps = [
  "Konsultasi Kebutuhan & Survei Lokasi",
  "Rancangan Konsep & Estimasi Biaya",
  "Pelaksanaan Produksi Presisi",
  "Quality Control & Serah Terima",
];

export default function About({ data }: AboutProps) {
  return (
    // Mengubah bg--[#E3DBBB] agar konsisten dengan teks gelap (Light Theme approach)
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FFFCF7] pt-28 pb-16" id="tentang">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Bagian Kiri (Teks) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeLeft}
          >
            {/* Badge: Menggunakan border gelap transparan agar kontras di BG terang */}
            <div className="inline-flex items-center space-x-2 bg-black/5 backdrop-blur-md border border-black/10 text-slate-800 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-600" />
              <span className="text-xs font-semibold tracking-widest uppercase">Tentang Kami</span>
            </div>

            {/* Heading: Ubah text-white ke text-slate-900 */}
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Lebih dari sekadar desain.<br />
              <span className="text-primary-700">Kami mengeksekusi visi.</span>
            </h2>

            <div className="h-1.5 w-20 bg-primary-600 mb-8 rounded-full" />

            {/* Deskripsi: Ubah text-slate-300 ke text-slate-700 */}
            <p className="font-body text-slate-700 text-lg leading-relaxed mb-6 font-medium">
              {data.description}
            </p>
            <p className="font-body text-slate-600 leading-relaxed mb-10">
              Fokus utama kami bukan sekadar menyajikan tampilan render 3D yang memukau, melainkan merealisasikan hunian dan proyek komersial tersebut menjadi karya nyata yang presisi, nyaman digunakan, dan realistis untuk dibangun.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl bg-white/40 border border-black/5 p-5 hover:bg-white/60 transition-colors shadow-sm"
                >
                  <span className="font-heading text-primary-700 text-xl font-bold leading-none mt-0.5">
                    0{index + 1}
                  </span>
                  <p className="font-body text-sm text-slate-800 font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Tombol: Ubah bg-white ke bg-slate-900 untuk kontras tinggi */}
            <Link href="#kontak" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-white bg-slate-900 hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl">
              Konsultasikan Proyek Anda
            </Link>
          </motion.div>

          {/* Bagian Kanan (Kartu Nilai / Values) */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeRight}
            style={{ perspective: 1200 }}
          >
            {/* Dekorasi Garis Halus */}
            <div className="absolute -inset-4 border border-black/5 rounded-[2.5rem] -z-10 hidden md:block" />

            <motion.div
              className="rounded-[2rem] border border-white/40 bg-white/30 p-6 md:p-8 shadow-2xl backdrop-blur-xl"
              whileHover={{ rotateY: -4, rotateX: 2, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              <div className="grid grid-cols-1 gap-6">

                {/* Highlight Tahun: Gunakan warna yang lebih hangat/gelap agar stand out */}
                <div className="rounded-[1.5rem] bg-slate-900 border border-slate-800 p-8 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                    <CheckCircle2 className="w-32 h-32 text-white" />
                  </div>
                  <div className="relative z-10">
                    <div className="font-heading text-6xl md:text-7xl font-bold text-white mb-2 transition-all">
                      {data.founded}
                    </div>
                    <div className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 mb-4">
                      Tahun Berdiri
                    </div>
                    <p className="font-body text-sm text-slate-300 leading-relaxed max-w-sm">
                      Tumbuh dan berkembang dari lokakarya <span className="italic text-white">furniture custom</span> hingga menangani paket renovasi dan arsitektural berskala besar.
                    </p>
                  </div>
                </div>

                {/* Grid Values: Menggunakan kartu putih transparan (Glassmorphism Light) */}
                <motion.div
                  className="grid sm:grid-cols-2 gap-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={staggerContainer}
                >
                  {values.map((value) => (
                    <motion.div
                      key={value.title}
                      variants={cardVariant}
                      className="rounded-[1.35rem] bg-white/50 border border-white/20 p-6 hover:bg-white/80 transition-all shadow-sm"
                    >
                      <h3 className="font-heading text-slate-900 font-bold text-base mb-2">
                        {value.title}
                      </h3>
                      <p className="font-body text-slate-600 text-sm leading-relaxed">
                        {value.desc}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}