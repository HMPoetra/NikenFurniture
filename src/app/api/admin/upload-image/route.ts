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
    const fileTypeRaw = String(formData.get("fileType") || "image").toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan." },
        { status: 400 },
      );
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const fileType = fileTypeRaw === "video" ? "video" : "image";

    if (fileType === "image" && !isImage) {
      return NextResponse.json(
        { success: false, message: "Hanya file gambar yang diperbolehkan." },
        { status: 400 },
      );
    }

    if (fileType === "video" && !isVideo) {
      return NextResponse.json(
        { success: false, message: "Hanya file video yang diperbolehkan." },
        { status: 400 },
      );
    }

    // Limit ukuran: 5MB untuk gambar, 50MB untuk video
    const maxBytes = fileType === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      const maxMB = fileType === "video" ? 50 : 5;
      return NextResponse.json(
        { success: false, message: `Ukuran maksimal ${maxMB}MB.` },
        { status: 400 },
      );
    }

    const folder = folderRaw === "services" ? "services" : "portfolio";
    const fileFolder = fileType === "video" ? "videos" : "images";
    const publicDir = path.join(process.cwd(), "public", fileFolder, folder);
    await mkdir(publicDir, { recursive: true });

    const filename = sanitizeFileName(file.name);
    const outputPath = path.join(publicDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(outputPath, buffer);

    const relativePath = `/${fileFolder}/${folder}/${filename}`;
    return NextResponse.json({ success: true, path: relativePath });
  } catch (error: any) {
    const status = error?.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal mengunggah file." },
      { status },
    );
  }
}
