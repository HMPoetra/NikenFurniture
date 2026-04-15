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

export function createFacebookHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "#";
  }

  if (trimmed.startsWith("http")) {
    return trimmed;
  }

  return `https://www.facebook.com/search/top?q=${encodeURIComponent(trimmed)}`;
}

export function createYoutubeHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "#";
  }

  if (trimmed.startsWith("http")) {
    return trimmed;
  }

  if (trimmed.startsWith("@")) {
    return `https://www.youtube.com/${trimmed}`;
  }

  return `https://www.youtube.com/results?search_query=${encodeURIComponent(trimmed)}`;
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

function decodeHexPath(value: string) {
  const trimmed = value.trim();
  const hexValue = trimmed.startsWith("\\x") ? trimmed.slice(2) : trimmed;

  if (!/^[0-9a-fA-F]+$/.test(hexValue) || hexValue.length % 2 !== 0) {
    return value;
  }

  try {
    let out = "";
    for (let i = 0; i < hexValue.length; i += 2) {
      out += String.fromCharCode(Number.parseInt(hexValue.slice(i, i + 2), 16));
    }
    return out;
  } catch {
    return value;
  }
}

function normalizePortfolioImagePath(image: string | null | undefined) {
  if (!image) return null;

  const trimmed = image.trim();
  if (!trimmed) return null;

  const decoded = trimmed.startsWith("\\x") ? decodeHexPath(trimmed) : trimmed;

  if (decoded.startsWith("http") || decoded.startsWith("/")) {
    return decoded;
  }

  return null;
}

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
  const normalizedImage = normalizePortfolioImagePath(image);
  if (normalizedImage) return normalizedImage;

  return portfolioPlaceholderByCategory[category] ?? "/images/portfolio/default.svg";
}
