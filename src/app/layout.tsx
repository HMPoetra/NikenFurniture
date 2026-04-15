import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCompanyInfo, getServices } from "@/lib/content";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Niken Furniture",
    template: "%s | Niken Furniture",
  },
  description:
    "Niken Furniture menghadirkan solusi pembangunan rumah, renovasi, interior custom, dan desain 3D untuk hunian serta ruang usaha dengan proses rapi dan tim berpengalaman.",
  keywords: [
    "furniture custom",
    "kontraktor rumah",
    "interior design",
    "renovasi rumah",
    "kitchen set",
    "desain 3D",
  ],
  openGraph: {
    title: "Niken Furniture",
    description:
      "Solusi pembangunan, renovasi, furniture custom, dan interior premium untuk hunian dan ruang usaha.",
    type: "website",
    locale: "id_ID",
    siteName: "Niken Furniture",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [companyInfo, services] = await Promise.all([
    getCompanyInfo(),
    getServices(),
  ]);

  return (
    <html lang="id" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="font-body antialiased">
        <Navbar company={companyInfo} />
        <main>{children}</main>
        <Footer company={companyInfo} services={services} />
      </body>
    </html>
  );
}
