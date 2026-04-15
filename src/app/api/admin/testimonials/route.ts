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
      .from("testimonials")
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
    const { nama, role, text_ulasan, rating, urutan, aktif } = body;
    if (!nama || !role || !text_ulasan)
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    const { error } = await supabase.from("testimonials").insert({
      nama,
      role,
      text_ulasan,
      rating: Number(rating) || 5,
      urutan: Number(urutan) || 0,
      aktif: aktif ? true : false,
    });
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Testimonial ditambahkan" });
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
      .from("testimonials")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Testimonial dihapus" });
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
    const { nama, role, text_ulasan, rating, urutan, aktif } = body;
    const { error } = await supabase
      .from("testimonials")
      .update({
        nama,
        role,
        text_ulasan,
        rating: Number(rating) || 5,
        urutan: Number(urutan) || 0,
        aktif: aktif ? true : false,
      })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Testimonial diperbarui" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
