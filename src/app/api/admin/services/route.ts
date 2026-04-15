import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

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

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("urutan", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
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
    const { slug, category, title, description, features, color, image, urutan, aktif, images, videos } = body;
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
      features: features || [],
      color: color || "from-amber-800 to-amber-600",
      image: image || "",
      urutan: Number(urutan) || 0,
      aktif: aktif ? true : false,
      images: images || null,
      videos: videos || null,
    };

    let { error } = await supabase.from("services").insert(payload);
    if (error && isMissingMediaColumnError(error)) {
      const { images: _images, videos: _videos, ...legacyPayload } = payload;
      const fallback = await supabase.from("services").insert(legacyPayload);
      error = fallback.error;
    }

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Service ditambahkan" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
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
      { success: false, message: "Unauthorized" },
      { status: 401 }
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
    const { slug, category, title, description, features, color, image, urutan, aktif, images, videos } = body;
    const payload = {
        slug,
        category,
        title,
        description,
        features: features || [],
        color,
        image,
        urutan: Number(urutan) || 0,
        aktif: aktif ? true : false,
        images: images || null,
        videos: videos || null,
      };

    let { error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", id);

    if (error && isMissingMediaColumnError(error)) {
      const { images: _images, videos: _videos, ...legacyPayload } = payload;
      const fallback = await supabase
        .from("services")
        .update(legacyPayload)
        .eq("id", id);
      error = fallback.error;
    }

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Service diperbarui" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
