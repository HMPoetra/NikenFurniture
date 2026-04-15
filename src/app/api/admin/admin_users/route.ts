import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import bcrypt from "bcryptjs";

function requireAuth(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  const validToken = process.env.ADMIN_TOKEN || "niken-admin-token";
  if (!token || token !== validToken) {
    throw new Error("AUTH_FAILED");
  }
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, role, created_at")
      .order("id", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error.message === "AUTH_FAILED") {
      return NextResponse.json(
        { success: false, message: "Token tidak valid atau hilang" },
        { status: 401 }
      );
    }
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAuth(req);
    const body = await req.json();
    const { username, password, role } = body;
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password harus diisi" },
        { status: 400 }
      );
    }
    const hash = await bcrypt.hash(password, 10);
    const { error } = await supabase.from("admin_users").insert({
      username,
      password: hash,
      role: role || "admin",
    });
    if (error) throw error;
    return NextResponse.json({
      success: true,
      message: "Admin user berhasil ditambahkan",
    });
  } catch (error: any) {
    if (error.message === "AUTH_FAILED") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Gagal menambah user" },
      { status: 500 }
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
      .from("admin_users")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true, message: "Admin user dihapus" });
  } catch (error: any) {
    if (error.message === "AUTH_FAILED")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    return NextResponse.json(
      { success: false, message: "Gagal menghapus" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    requireAuth(req);
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { success: false, message: "ID tidak ditemukan" },
        { status: 400 }
      );

    const body = await req.json();
    const updates: Record<string, any> = {};

    if (body.username) updates.username = body.username;
    if (body.role) updates.role = body.role;
    if (body.password) {
      updates.password = await bcrypt.hash(body.password, 10);
    }

    if (Object.keys(updates).length === 0)
      return NextResponse.json(
        { success: false, message: "Tidak ada data untuk diubah" },
        { status: 400 }
      );

    const { error } = await supabase
      .from("admin_users")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({
      success: true,
      message: "Admin user diperbarui",
    });
  } catch (error: any) {
    if (error.message === "AUTH_FAILED")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui" },
      { status: 500 }
    );
  }
}
