import { NextRequest, NextResponse } from "next/server";

let testimonials: { id: string; name: string; company: string; text: string; rating: number }[] = [
  { id: "1", name: "Ahmed Ibrahim", company: "Ibrahim Construction", text: "Great service!", rating: 5 },
];

export async function GET() {
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem = {
      id: String(Date.now()),
      name: body.name,
      company: body.company,
      text: body.text,
      rating: body.rating,
    };
    testimonials.push(newItem);
    return NextResponse.json({ success: true, testimonial: newItem });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  testimonials = testimonials.filter((t) => t.id !== id);
  return NextResponse.json({ success: true });
}
