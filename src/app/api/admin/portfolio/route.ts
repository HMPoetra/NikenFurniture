import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { normalizePortfolioMediaItem } from "@/lib/portfolio-media";

export const dynamic = "force-dynamic";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  if (token !== (process.env.ADMIN_TOKEN || "niken-admin-token")) {
    throw new Error("unauthorized");
  }
}

type PortfolioItemRow = {
  id: number;
  category: string;
  title: string;
  location: string;
  year: string;
  description: string | null;
  urutan: number | null;
  aktif: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  portfolio_media:
    | Array<{
        id: number;
        file_type: string;
        file_name: string | null;
        urutan: number | null;
      }>
    | null;
};

function mapPortfolioItem(row: PortfolioItemRow) {
  const media = (row.portfolio_media || [])
    .map((entry) => normalizePortfolioMediaItem(entry))
    .sort((left, right) => left.urutan - right.urutan || left.id - right.id);
  const coverMedia = media.find((entry) => entry.fileType === "image") ?? null;

  return {
    id: row.id,
    category: row.category,
    title: row.title,
    location: row.location,
    year: row.year,
    description: row.description || "",
    urutan: row.urutan ?? 0,
    aktif: row.aktif ?? true,
    created_at: row.created_at,
    updated_at: row.updated_at,
    image: coverMedia?.url ?? null,
    coverMediaUrl: coverMedia?.url ?? null,
    media,
  };
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, category, title, location, year, description, urutan, aktif, created_at, updated_at, portfolio_media(id, file_type, file_name, urutan)")
      .order("urutan", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ success: true, data: (data as PortfolioItemRow[]).map(mapPortfolioItem) });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
    const body = await req.json();
    const { category, title, location, year, description, urutan, aktif } = body;

    if (!category || !title || !location || !year) {
      return NextResponse.json(
        { success: false, message: "Kategori, judul, lokasi, dan tahun wajib diisi" },
        { status: 400 },
      );
    }

    const payload = {
      category,
      title,
      location,
      year,
      description: description || "",
      urutan: Number(urutan) || 0,
      aktif: aktif ? true : false,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("portfolio_items")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Berhasil ditambah", data });
  } catch (error: any) {
    const status = error?.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal menambah data" },
      { status }
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
      .from("portfolio_items")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (error: any) {
    const status = error?.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal menghapus data" },
      { status }
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
      const { category, title, location, year, description, urutan, aktif } = body;

      if (!category || !title || !location || !year) {
        return NextResponse.json(
          { success: false, message: "Kategori, judul, lokasi, dan tahun wajib diisi" },
          { status: 400 },
        );
      }

    const payload = {
        category,
        title,
        location,
        year,
        description: description || "",
        urutan: Number(urutan) || 0,
        aktif: aktif ? true : false,
        updated_at: new Date().toISOString(),
      };

    let { error } = await supabase
      .from("portfolio_items")
      .update(payload)
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Berhasil diupdate" });
  } catch (error: any) {
    const status = error?.message === "unauthorized" ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal mengupdate data" },
      { status }
    );
  }
}