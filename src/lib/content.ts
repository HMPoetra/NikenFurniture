import supabase from "@/lib/db";
import type { CompanyInfo } from "@/lib/site";

type ServiceRow = {
  slug: string;
  category: string;
  title: string;
  description: string | null;
  features: string[] | null;
  color: string | null;
  image: string | null;
  urutan: number;
};

type PortfolioRow = {
  id: number;
  category: string;
  title: string;
  location: string | null;
  year: string | null;
  image: string | null;
  description: string | null;
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

function parseJsonArray(value: string[] | string | null) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value as string);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
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
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true })
    .order("id", { ascending: false });
  if (error) throw error;

  return (data as ServiceRow[]).map((item) => ({
    id: item.slug,
    category: item.category,
    title: item.title,
    description: item.description || "",
    features: parseJsonArray(item.features),
    color: item.color || "from-slate-700 to-slate-500",
    image: item.image,
    urutan: item.urutan,
  }));
}

export async function getServiceById(id: string) {
  const services = await getServices();
  return services.find((service) => service.id === id) || null;
}

export async function getPortfolioItems() {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("aktif", true)
    .order("urutan", { ascending: true })
    .order("id", { ascending: false });
  if (error) throw error;

  return (data as PortfolioRow[]).map((item) => ({
    id: item.id,
    category: item.category,
    title: item.title,
    location: item.location || "",
    year: item.year || "",
    image: item.image,
    description: item.description || "",
  }));
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