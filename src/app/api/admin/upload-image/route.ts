import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token")) {
    throw new Error("unauthorized");
  }
}

function sanitizeFileName(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const safeExt = ext && ext.length <= 6 ? ext : ".jpg";
  return `${base || "image"}-${Date.now()}${safeExt}`;
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);

    const formData = await req.formData();
    const file = formData.get("file");
    const folderRaw = String(formData.get("folder") || "").toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File gambar tidak ditemukan." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Hanya file gambar yang diperbolehkan." },
        { status: 400 },
      );
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, message: "Ukuran gambar maksimal 5MB." },
        { status: 400 },
      );
    }

    const folder = folderRaw === "services" ? "services" : "portfolio";
    const publicDir = path.join(process.cwd(), "public", "images", folder);
    await mkdir(publicDir, { recursive: true });

    const filename = sanitizeFileName(file.name);
    const outputPath = path.join(publicDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(outputPath, buffer);

    const relativePath = `/images/${folder}/${filename}`;
    return NextResponse.json({ success: true, path: relativePath });
  } catch (error: any) {
    const status = error?.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal mengunggah gambar." },
      { status },
    );
  }
}
