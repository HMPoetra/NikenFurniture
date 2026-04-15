import { NextResponse } from "next/server";
import supabase from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, category, title, location, year, image, description")
      .eq("aktif", true)
      .order("urutan", { ascending: true })
      .order("id", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Portfolio API Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data portofolio" },
      { status: 500 }
    );
  }
}
