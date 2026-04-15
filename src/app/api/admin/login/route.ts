import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import supabase from "@/lib/db";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "niken-admin-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, password, nama")
      .eq("username", username)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, data.password);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      token: ADMIN_TOKEN,
      user: { id: data.id, username: data.username, nama: data.nama },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
