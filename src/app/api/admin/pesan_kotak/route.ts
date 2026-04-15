import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { decryptText } from "@/lib/secure-data";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token"))
    throw new Error("unauthorized");
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { data, error } = await supabase
      .from("pesan_kontak")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;

    const decrypted = (data || []).map((item) => ({
      ...item,
      nama: decryptText(item.nama),
      telepon: decryptText(item.telepon),
      email: decryptText(item.email),
      layanan: decryptText(item.layanan),
      lokasi: decryptText(item.lokasi),
      budget: decryptText(item.budget),
      pesan: decryptText(item.pesan),
    }));

    return NextResponse.json({ success: true, data: decrypted });
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
        { success: false, message: "ID tidak ditemukan" },
        { status: 400 }
      );
    const { error } = await supabase
      .from("pesan_kontak")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Pesan dihapus" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
