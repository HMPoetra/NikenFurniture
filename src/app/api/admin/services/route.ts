import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token")) {
    throw new Error("unauthorized");
  }
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
    const { slug, category, title, description, features, color, image, urutan, aktif } = body;
    if (!slug || !category || !title || !description) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("services").insert({
      slug,
      category,
      title,
      description,
      features: features || [],
      color: color || "from-amber-800 to-amber-600",
      image: image || "",
      urutan: Number(urutan) || 0,
      aktif: aktif ? true : false,
    });
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
    const { slug, category, title, description, features, color, image, urutan, aktif } = body;
    const { error } = await supabase
      .from("services")
      .update({
        slug,
        category,
        title,
        description,
        features: features || [],
        color,
        image,
        urutan: Number(urutan) || 0,
        aktif: aktif ? true : false,
      })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Service diperbarui" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
