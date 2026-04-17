import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import {
  decodeBytea,
  guessPortfolioMediaContentType,
} from "@/lib/portfolio-media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const mediaId = Number(id);

    if (!Number.isFinite(mediaId)) {
      return NextResponse.json({ success: false, message: "ID media tidak valid" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("portfolio_media")
      .select("id, file_type, file_data, file_name")
      .eq("id", mediaId)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: "Media tidak ditemukan" }, { status: 404 });
    }

    const buffer = decodeBytea((data as { file_data: unknown }).file_data);
    if (!buffer) {
      return NextResponse.json({ success: false, message: "Media rusak atau tidak valid" }, { status: 500 });
    }

    const contentType = guessPortfolioMediaContentType(
      (data as { file_type: string }).file_type === "video" ? "video" : "image",
      (data as { file_name: string | null }).file_name,
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Portfolio media API Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil media" }, { status: 500 });
  }
}
