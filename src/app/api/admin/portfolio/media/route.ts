import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { encodeBytea } from "@/lib/portfolio-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token")) {
    throw new Error("unauthorized");
  }
}

function isVideoFile(file: File) {
  return file.type.startsWith("video/");
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);

    const formData = await req.formData();
    const file = formData.get("file");
    const portfolioIdRaw = String(formData.get("portfolioId") || "");
    const fileTypeRaw = String(formData.get("fileType") || "image").toLowerCase();
    const urutanRaw = String(formData.get("urutan") || "0");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "File tidak ditemukan." }, { status: 400 });
    }

    const portfolioId = Number(portfolioIdRaw);
    if (!Number.isFinite(portfolioId)) {
      return NextResponse.json({ success: false, message: "ID portofolio tidak valid." }, { status: 400 });
    }

    const fileType = fileTypeRaw === "video" ? "video" : "image";
    if (fileType === "image" && !isImageFile(file)) {
      return NextResponse.json({ success: false, message: "Hanya file gambar yang diperbolehkan." }, { status: 400 });
    }

    if (fileType === "video" && !isVideoFile(file)) {
      return NextResponse.json({ success: false, message: "Hanya file video yang diperbolehkan." }, { status: 400 });
    }

    const maxBytes = fileType === "video" ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, message: fileType === "video" ? "Ukuran video maksimal 50MB." : "Ukuran gambar maksimal 5MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const payload = {
      portfolio_id: portfolioId,
      file_type: fileType,
      file_data: encodeBytea(buffer),
      file_name: file.name,
      urutan: Number(urutanRaw) || 0,
    };

    const { data, error } = await supabase
      .from("portfolio_media")
      .insert(payload)
      .select("id, portfolio_id, file_type, file_name, urutan")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data, message: "Media berhasil ditambahkan" });
  } catch (error: any) {
    const status = error?.message === "unauthorized" ? 401 : 500;
    return NextResponse.json({ success: false, message: error?.message || "Gagal mengunggah media" }, { status });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    requireAuth(req);

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "ID media diperlukan" }, { status: 400 });
    }

    const { error } = await supabase.from("portfolio_media").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Media berhasil dihapus" });
  } catch (error: any) {
    const status = error?.message === "unauthorized" ? 401 : 500;
    return NextResponse.json({ success: false, message: error?.message || "Gagal menghapus media" }, { status });
  }
}
