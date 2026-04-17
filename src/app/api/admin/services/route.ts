import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { normalizeServiceMediaItem } from "@/lib/service-media";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token")) {
    throw new Error("unauthorized");
  }
}

function parseFeatures(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function isTruthy(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { data, error } = await supabase
      .from("services")
      .select("id, slug, category, title, description, features, color, urutan, aktif, service_media(id, media_type, file_name, urutan)")
      .order("urutan", { ascending: true });
    if (error) throw error;

    const normalized = (data || []).map((item: any) => {
      const media = (item.service_media || [])
        .map((entry: any) => normalizeServiceMediaItem(entry))
        .sort((left: any, right: any) => left.urutan - right.urutan || left.id - right.id);
      const images = media.filter((entry: any) => entry.mediaType === "image");
      const videos = media.filter((entry: any) => entry.mediaType === "video");

      return {
        ...item,
        media,
        image: images[0]?.url ?? null,
        images: images.map((entry: any) => entry.url),
        videos: videos.map((entry: any) => entry.url),
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
    const body = await req.json();
    const { slug, category, title, description, features, color, urutan, aktif } = body;
    if (!slug || !category || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }
    const payload = {
      slug,
      category,
      title,
      description,
      features: parseFeatures(features),
      color: color || "from-amber-800 to-amber-600",
      urutan: Number(urutan) || 0,
      aktif: isTruthy(aktif),
    };

    const { data, error } = await supabase
      .from("services")
      .insert(payload)
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Service ditambahkan", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: String((error as any)?.message || "Gagal menyimpan service") },
      { status: (error as any)?.message === "unauthorized" ? 401 : 500 }
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
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Service dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String((error as any)?.message || "Gagal menghapus service") },
      { status: (error as any)?.message === "unauthorized" ? 401 : 500 }
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
    const { slug, category, title, description, features, color, urutan, aktif } = body;
    const payload = {
      slug,
      category,
      title,
      description,
      features: parseFeatures(features),
      color,
      urutan: Number(urutan) || 0,
      aktif: isTruthy(aktif),
    };

    const { error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Service diperbarui" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String((error as any)?.message || "Gagal memperbarui service") },
      { status: (error as any)?.message === "unauthorized" ? 401 : 500 }
    );
  }
}
