export type CompanyInfo = {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  mapsEmbed: string;
  founded: string;
  projects: string;
  clients: string;
  team: string;
};

export function normalizePhoneDigits(phone: string) {
  return phone.replace(/[^0-9]/g, "");
}

export function normalizeWhatsAppNumber(phone: string) {
  const digits = normalizePhoneDigits(phone);
  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  return digits;
}

export function createWhatsAppHref(phone: string, message?: string) {
  const number = normalizeWhatsAppNumber(phone);

  if (!message) {
    return `https://wa.me/${number}`;
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function createTelHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function createMailHref(email: string) {
  return `mailto:${email}`;
}

export function createInstagramHref(handle: string) {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

export function createMapsSearchHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const portfolioPlaceholderByCategory: Record<string, string> = {
  "Pembangunan Rumah": "/images/portfolio/placeholder-home.svg",
  "Kitchen Set": "/images/portfolio/placeholder-kitchen.svg",
  "Renovasi Rumah": "/images/portfolio/placeholder-renovation.svg",
  "Interior Kamar": "/images/portfolio/placeholder-bedroom.svg",
  "Kolam Renang": "/images/portfolio/placeholder-pool.svg",
  "Taman & Area Outdoor": "/images/portfolio/placeholder-outdoor.svg",
  "Interior Ruangan": "/images/portfolio/placeholder-interior.svg",
  Desain: "/images/portfolio/placeholder-design.svg",
};

/**
 * Resolusi path gambar portofolio:
 * - Path apapun yang dimulai dengan "/" (dari DB) → digunakan langsung
 * - String URL eksternal (http/https) → digunakan langsung
 * - Null/kosong → fallback ke placeholder berdasarkan kategori
 */
export function resolvePortfolioImage(
  category: string,
  image: string | null | undefined,
): string {
  if (image && (image.startsWith("/") || image.startsWith("http"))) {
    return image;
  }
  return portfolioPlaceholderByCategory[category] ?? "/images/portfolio/default.svg";
}
