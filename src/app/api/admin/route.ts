import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@reddotmetal.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

let inquiries: { id: string; name: string; company?: string; phone: string; message: string; createdAt: string }[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (type === "inquiries") {
    return NextResponse.json({ inquiries });
  }

  return NextResponse.json({});
}
