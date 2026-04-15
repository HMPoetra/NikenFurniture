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
      .from("company_info")
      .select("key, value");
    if (error) throw error;
    const result: Record<string, string> = {};
    for (const row of data as Array<{ key: string; value: string }>) {
      result[row.key] = row.value;
    }
    return NextResponse.json({ success: true, data: result });
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
    const entries = Object.entries(body) as [string, string][];
    for (const [key, value] of entries) {
      const { error } = await supabase
        .from("company_info")
        .upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
    }
    return NextResponse.json({ success: true, message: "Company info updated" });
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
    const body = await req.json();
    const entries = Object.entries(body) as [string, string][];
    for (const [key, value] of entries) {
      const { error } = await supabase
        .from("company_info")
        .upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
    }
    return NextResponse.json({ success: true, message: "Company info updated" });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
}
