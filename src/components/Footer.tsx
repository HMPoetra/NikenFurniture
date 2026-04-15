"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";
import type { CompanyInfo } from "@/lib/site";
import {
  createInstagramHref,
  createMailHref,
  createMapsSearchHref,
  createTelHref,
  createWhatsAppHref,
} from "@/lib/site";

type FooterProps = {
  company: CompanyInfo;
  services: Array<{ id: string; title: string }>;
};

export default function Footer({ company, services }: FooterProps) {
  const linkColumns = [
    {
      title: "Layanan",
      // Diambil dinamis dari database — tampilkan max 6 item
      items: services.slice(0, 6).map((s) => ({
        label: s.title,
        href: `/layanan/${s.id}`,
      })),
    },
    {
      title: "Informasi",
      items: [
        { label: "Tentang Kami", href: "#tentang-kami" },
        { label: "Portofolio", href: "#portofolio" },
        { label: "Pengalaman", href: "#pengalaman" },
        { label: "Hubungi Kami", href: "#kontak" },
      ],
    },
    {
      title: "Kontak",
      items: [
        { label: company.phone, href: createTelHref(company.phone) },
        { label: company.email, href: createMailHref(company.email) },
        { label: company.instagram, href: createInstagramHref(company.instagram) },
        {
          label: "Lihat lokasi kami",
          href: createMapsSearchHref(company.address),
        },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-900 text-slate-400">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 bg-animated"
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none float-a"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-primary-600/10 blur-3xl pointer-events-none float-b"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #a5b4fc 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <div className="font-heading text-2xl font-bold text-white mb-1 tracking-wide">
              {company.name}
            </div>
            <div className="text-primary-400 text-[10px] tracking-[0.45em] uppercase font-body mb-5">
              Furniture and Interior
            </div>
            <p className="font-body text-sm leading-relaxed text-slate-400 mb-5">
              Solusi pembangunan, renovasi, dan interior custom untuk hunian dan
              ruang usaha. Kami bantu dari perencanaan, produksi, sampai serah
              terima proyek.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={createWhatsAppHref(
                  company.phone,
                  `Halo ${company.name}, saya ingin konsultasi proyek.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors duration-300"
              >
                Chat WhatsApp
              </a>
              <a
                href="#kontak"
                className="inline-flex items-center justify-center gap-2 border border-slate-700 hover:border-primary-500 text-slate-200 text-xs font-semibold px-4 py-2 rounded-full transition-colors duration-300"
              >
                Turun ke Kontak
              </a>
            </div>
          </motion.div>

          {linkColumns.map((column) => (
            <motion.div key={column.title} variants={fadeUp}>
              <h4 className="font-heading text-white font-semibold mb-5 text-sm uppercase tracking-widest">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.items.map((item) => {
                  const external = item.href.startsWith("http") || item.href.startsWith("mailto:") || item.href.startsWith("tel:");

                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={external && item.href.startsWith("http") ? "_blank" : undefined}
                        rel={external && item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-body text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200 leading-relaxed"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs text-slate-500">
            © {new Date().getFullYear()} {company.name}. Seluruh materi situs ini
            digunakan untuk presentasi layanan dan konsultasi proyek.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Respon lead: 1x24 jam</span>
            <span>Survey lokasi by appointment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
