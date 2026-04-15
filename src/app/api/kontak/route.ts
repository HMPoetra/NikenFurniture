import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, telepon, email, layanan, lokasi, budget, pesan } = body;
    if (!nama || !telepon || !layanan || !pesan) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("pesan_kontak").insert({
      nama,
      telepon,
      email: email || null,
      layanan,
      lokasi: lokasi || null,
      budget: budget || null,
      pesan,
    });
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Pesan terkirim" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
