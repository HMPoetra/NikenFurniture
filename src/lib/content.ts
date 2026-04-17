import supabase from "@/lib/db";
import type { CompanyInfo } from "@/lib/site";
import { normalizePortfolioMediaItem } from "@/lib/portfolio-media";
import { normalizeServiceMediaItem } from "@/lib/service-media";

type ServiceRow = {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string | null;
  features: unknown;
  color: string | null;
  urutan: number | null;
  aktif: boolean | null;
  service_media:
    | Array<{
        id: number;
        media_type: string;
        file_name: string | null;
        urutan: number | null;
      }>
    | null;
};

type PortfolioRow = {
  id: number;
  category: string;
  title: string;
  location: string | null;
  year: string | null;
  description: string | null;
  urutan: number | null;
  aktif: boolean | null;
  portfolio_media:
    | Array<{
        id: number;
        file_type: string;
        file_name: string | null;
        urutan: number | null;
      }>
    | null;
};

type ExperienceRow = {
  id: number;
  year: string;
  title: string;
  description: string | null;
};

type TestimonialRow = {
  id: number;
  nama: string;
  role: string;
  text_ulasan: string;
  rating: number;
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

function normalizeServiceMediaPath(value: string | null | undefined) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const decoded = trimmed.startsWith("\\x") ? decodeHexPath(trimmed) : trimmed;

  if (decoded.startsWith("http") || decoded.startsWith("/")) {
    return decoded;
  }

  if (decoded.startsWith("images/services/")) {
    return `/${decoded}`;
  }

  return `/images/services/${decoded.replace(/^\/+/, "")}`;
}

function parseJsonArray(value: unknown) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => String(entry).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getCompanyInfo() {
  const { data, error } = await supabase
    .from("company_info")
    .select("key, value");
  if (error) throw error;

  const result = {} as Record<string, string>;
  for (const row of data as Array<{ key: string; value: string }>) {
    result[row.key] = row.value;
  }

  return {
    name: result.name || "Niken Furniture",
    tagline: result.tagline || "Membangun Ruang, Merangkai Mimpi",
    description:
      result.description ||
      "Niken Furniture adalah perusahaan profesional yang bergerak di bidang furniture custom, kontraktor bangunan, serta desain dan interior untuk hunian dan ruang usaha.",
    address: result.address || "Jl. Kayu Manis No. 12, Menteng, Jakarta Pusat",
    phone: result.phone || "+62 812-3456-7890",
    email: result.email || "info@nikenfurniture.com",
    instagram: result.instagram || "@niken.furniture",
    facebook: result.facebook || "Niken Furniture Official",
    youtube: result.youtube || "Niken Furniture",
    mapsEmbed:
      result.maps_embed ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.0!2d106.75!3d-6.32!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTknMTIuMCJTIDEwNsKwNDUnMDAuMCJF!5e0!3m2!1sen!2sid!4v1",
    founded: result.founded || "2010",
    projects: result.projects || "500+",
    clients: result.clients || "350+",
    team: result.team || "45+",
  } satisfies CompanyInfo;
}

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, category, title, description, features, color, urutan, aktif, service_media(id, media_type, file_name, urutan)")
    .eq("aktif", true)
    .order("urutan", { ascending: true })
    .order("id", { ascending: false });
  if (error) throw error;

  return (data as ServiceRow[]).map((item) => {
    const media = (item.service_media || [])
      .map((entry) => normalizeServiceMediaItem(entry))
      .sort((left, right) => left.urutan - right.urutan || left.id - right.id);
    const images = media.filter((entry) => entry.mediaType === "image");
    const videos = media.filter((entry) => entry.mediaType === "video");
    const coverImage = images[0] ?? null;

    return {
      id: item.slug,
      slug: item.slug,
      category: item.category,
      title: item.title,
      description: item.description || "",
      features: parseJsonArray(item.features),
      color: item.color || "from-slate-700 to-slate-500",
      image: coverImage?.url ?? null,
      images: images.map((entry) => entry.url),
      videos: videos.map((entry) => entry.url),
      media,
      urutan: item.urutan ?? 0,
      aktif: item.aktif ?? true,
    };
  });
}

export async function getServiceById(id: string) {
  const services = await getServices();
  return services.find((service) => service.id === id) || null;
}

export async function getPortfolioItems() {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("id, category, title, location, year, description, urutan, aktif, portfolio_media(id, file_type, file_name, urutan)")
    .eq("aktif", true)
    .order("urutan", { ascending: true })
    .order("id", { ascending: false });
  if (error) throw error;

  return (data as PortfolioRow[]).map((item) => {
    const media = (item.portfolio_media || [])
      .map((entry) => normalizePortfolioMediaItem(entry))
      .sort((left, right) => left.urutan - right.urutan || left.id - right.id);
    const coverMedia = media.find((entry) => entry.fileType === "image") ?? null;

    return {
      id: item.id,
      category: item.category,
      title: item.title,
      location: item.location || "",
      year: item.year || "",
      image: coverMedia?.url ?? null,
      coverMediaUrl: coverMedia?.url ?? null,
      media,
      description: item.description || "",
      urutan: item.urutan ?? 0,
      aktif: item.aktif ?? true,
    };
  });
}

export async function getPortfolioItemById(id: string | number) {
  const items = await getPortfolioItems();
  const targetId = Number(id);

  if (!Number.isFinite(targetId)) {
    return null;
  }

  return items.find((item) => item.id === targetId) || null;
}

export async function getExperiences() {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true })
    .order("id", { ascending: false });
  if (error) throw error;

  return (data as ExperienceRow[]).map((item) => ({
    id: item.id,
    year: item.year,
    title: item.title,
    description: item.description || "",
  }));
}

export async function getTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true })
    .order("id", { ascending: false });
  if (error) throw error;

  return (data as TestimonialRow[]).map((item) => ({
    id: item.id,
    name: item.nama,
    role: item.role,
    text: item.text_ulasan,
    rating: item.rating,
  }));
}

export async function getAllContent() {
  const [companyInfo, services, portfolioItems, experiences, testimonials] =
    await Promise.all([
      getCompanyInfo(),
      getServices(),
      getPortfolioItems(),
      getExperiences(),
      getTestimonials(),
    ]);

  return { companyInfo, services, portfolioItems, experiences, testimonials };
}