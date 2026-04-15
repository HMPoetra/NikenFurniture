import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export const dynamic = "force-dynamic";

function resolveImagePath(image: string | null | undefined): string {
  if (!image) return "/images/portfolio/default.jpg";
  return image.startsWith("/") ? image : `/images/portfolio/${image}`;
}

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token")) {
    throw new Error("unauthorized");
  }
}

function isMissingMediaColumnError(error: unknown): boolean {
  const message = String((error as any)?.message || "").toLowerCase();
  return message.includes("column") && (message.includes("images") || message.includes("videos"));
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("aktif", true)
      .order("urutan", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
    const body = await req.json();
    const { category, title, location, year, image, description, urutan, aktif, images, videos } = body;
    const finalPath = resolveImagePath(image);

    const payload = {
      category,
      title,
      location,
      year,
      image: finalPath,
      description: description || "",
      urutan: Number(urutan) || 0,
      aktif: aktif ? true : false,
      images: images || null,
      videos: videos || null,
    };

    let { error } = await supabase.from("portfolio_items").insert(payload);
    if (error && isMissingMediaColumnError(error)) {
      const { images: _images, videos: _videos, ...legacyPayload } = payload;
      const fallback = await supabase.from("portfolio_items").insert(legacyPayload);
      error = fallback.error;
    }
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Berhasil ditambah" });
  } catch (error: any) {
    const status = error.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    requireAuth(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { success: false, message: "ID diperlukan" },
        { status: 400 }
      );
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error: any) {
    const status = error.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    requireAuth(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { success: false, message: "ID diperlukan" },
        { status: 400 }
      );
    const body = await req.json();
    const { category, title, location, year, image, description, urutan, aktif, images, videos } = body;
    const finalPath = resolveImagePath(image);

    const payload = {
        category,
        title,
        location,
        year,
        image: finalPath,
        description: description || "",
        urutan: Number(urutan) || 0,
        aktif: aktif ? true : false,
        images: images || null,
        videos: videos || null,
      };

    let { error } = await supabase
      .from("portfolio_items")
      .update(payload)
      .eq("id", id);

    if (error && isMissingMediaColumnError(error)) {
      const { images: _images, videos: _videos, ...legacyPayload } = payload;
      const fallback = await supabase
        .from("portfolio_items")
        .update(legacyPayload)
        .eq("id", id);
      error = fallback.error;
    }

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Berhasil diupdate" });
  } catch (error: any) {
    const status = error.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message },
      { status }
    );
  }
}