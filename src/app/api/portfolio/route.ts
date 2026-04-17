import { NextResponse } from "next/server";
import { getPortfolioItems } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioItems();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Portfolio API Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data portofolio" },
      { status: 500 }
    );
  }
}
