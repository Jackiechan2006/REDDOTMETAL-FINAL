import { NextRequest, NextResponse } from "next/server";

let prices: { id: string; metal: string; price: string; condition: string }[] = [
  { id: "1", metal: "Copper (Bright)", price: "8.50 - 9.20", condition: "Clean, uncoated" },
  { id: "2", metal: "Aluminium (Extrusions)", price: "1.80 - 2.20", condition: "Clean, dry" },
];

export async function GET() {
  return NextResponse.json({ prices });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newPrice = {
      id: String(Date.now()),
      metal: body.metal,
      price: body.price,
      condition: body.condition,
    };
    prices.push(newPrice);
    return NextResponse.json({ success: true, price: newPrice });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  prices = prices.filter((p) => p.id !== id);
  return NextResponse.json({ success: true });
}
