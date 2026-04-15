import { MetadataRoute } from "next";
import { getServices } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.nikenfurniture.com";
  const lastModified = new Date("2026-03-26");
  const services = await getServices();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...services.map((service) => ({
      url: `${baseUrl}/layanan/${service.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}