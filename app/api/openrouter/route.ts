import { NextRequest, NextResponse } from "next/server";
import { searchCatalog } from "@/lib/openrouter";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  try {
    const results = await searchCatalog(q);
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load catalog" },
      { status: 502 },
    );
  }
}
