import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token"))
    throw new Error("unauthorized");
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("urutan", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch {
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
    const { year, title, description, urutan, aktif } = body;
    if (!year || !description)
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    const { error } = await supabase.from("experiences").insert({
      year,
      title: title || "",
      description,
      urutan: Number(urutan) || 0,
      aktif: aktif ? true : false,
    });
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Experience ditambahkan" });
  } catch {
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
    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Experience dihapus" });
  } catch {
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
    const { year, title, description, urutan, aktif } = body;
    const { error } = await supabase
      .from("experiences")
      .update({
        year,
        title,
        description,
        urutan: Number(urutan) || 0,
        aktif: aktif ? true : false,
      })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Experience diperbarui" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
