import path from "path";

export type PortfolioMediaType = "image" | "video";

export type PortfolioMediaItem = {
  id: number;
  fileType: PortfolioMediaType;
  fileName: string | null;
  urutan: number;
  url: string;
};

export function buildPortfolioMediaUrl(id: number) {
  return `/api/portfolio/media/${id}`;
}

export function encodeBytea(buffer: Buffer) {
  return `\\x${buffer.toString("hex")}`;
}

export function decodeBytea(value: unknown) {
  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }

  if (Array.isArray(value)) {
    return Buffer.from(value);
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("\\x")) {
    return Buffer.from(trimmed.slice(2), "hex");
  }

  if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0) {
    return Buffer.from(trimmed, "hex");
  }

  try {
    const base64 = Buffer.from(trimmed, "base64");
    if (base64.length > 0) {
      return base64;
    }
  } catch {
    return null;
  }

  return null;
}

export function guessPortfolioMediaContentType(
  fileType: PortfolioMediaType,
  fileName: string | null | undefined,
) {
  const ext = path.extname(fileName || "").toLowerCase();

  if (fileType === "video") {
    if (ext === ".webm") return "video/webm";
    if (ext === ".mov") return "video/quicktime";
    return "video/mp4";
  }

  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".avif") return "image/avif";
  return "image/jpeg";
}

export function normalizePortfolioMediaItem(row: {
  id: number;
  file_type: string;
  file_name: string | null;
  urutan: number | null;
}): PortfolioMediaItem {
  return {
    id: row.id,
    fileType: row.file_type === "video" ? "video" : "image",
    fileName: row.file_name,
    urutan: row.urutan ?? 0,
    url: buildPortfolioMediaUrl(row.id),
  };
}
