"use client";

import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { CompanyInfo } from "@/lib/site";
import { createWhatsAppHref } from "@/lib/site";

const navLinks = [
  { href: "#", label: "Beranda" },
  { href: "#tentang", label: "Tentang Kami" },
  { href: "#layanan", label: "Layanan" },
  { href: "#portofolio", label: "Portofolio" },
  { href: "#kontak", label: "Kontak" },
];

const mobileMenuVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const mobileListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

type NavbarProps = {
  company: CompanyInfo;
};

export default function Navbar({ company }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled
        ? "bg-white/90 backdrop-blur-md shadow-lg shadow-slate-400/20 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-heading text-2xl font-bold text-slate-800 tracking-wide group-hover:text-primary-600 transition-colors">
              {company.name}
            </span>
            <span className="text-primary-600 text-[10px] tracking-[0.4em] uppercase font-body font-medium">
              {company.tagline}
            </span>
          </Link>
        </motion.div>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.3 + i * 0.08,
                ease: "easeOut",
              }}
            >
              <a
                href={link.href}
                className="font-body text-sm font-medium tracking-wider uppercase transition-colors duration-300 relative text-slate-600 hover:text-primary-600 after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-primary-600 after:transition-all after:duration-300 after:w-0 hover:after:w-full"
              >
                {link.label}
              </a>
            </motion.li>
          ))}

          <motion.li
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
          >
            <a href="#kontak" className="btn-primary text-xs py-2.5 px-6">
              Konsultasi Gratis
            </a>
            <a
              href={createWhatsAppHref(
                company.phone,
                `Halo ${company.name}, saya ingin konsultasi proyek.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-primary-600 transition-colors duration-300 text-xs font-semibold uppercase tracking-wider"
            >
              WhatsApp
            </a>
            <Link
              href="/admin"
              aria-label="Masuk ke admin"
              className="text-slate-600 hover:text-primary-600 transition-colors duration-300"
            >
              <UserCircleIcon className="h-7 w-7" />
            </Link>
          </motion.li>
        </ul>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </motion.button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden bg-white/95 backdrop-blur-md overflow-hidden"
          >
            <motion.ul
              className="flex flex-col gap-4 px-6 py-6"
              initial="hidden"
              animate="visible"
              variants={mobileListVariants}
            >
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={mobileItemVariants}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-slate-700 hover:text-primary-600 font-body text-sm uppercase tracking-wider font-medium block py-2 border-b border-slate-200"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li variants={mobileItemVariants}>
                <a
                  href="#kontak"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary inline-block text-center w-full py-3"
                >
                  Konsultasi Gratis
                </a>
              </motion.li>
              <motion.li variants={mobileItemVariants}>
                <a
                  href={createWhatsAppHref(
                    company.phone,
                    `Halo ${company.name}, saya ingin konsultasi proyek.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="btn-outline inline-block text-center w-full py-3"
                >
                  Chat WhatsApp
                </a>
              </motion.li>
              <motion.li variants={mobileItemVariants}>
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-none border-2 border-slate-300 text-slate-700 hover:text-primary-600 hover:border-primary-600 transition-colors duration-300 text-sm font-semibold uppercase tracking-wider"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Login Admin
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
