import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Test route to debug Polymarket API
 */
export async function GET() {
  const GAMMA_API_BASE = process.env.POLYMARKET_API_URL || "https://gamma-api.polymarket.com";
  const url = `${GAMMA_API_BASE}/markets?limit=3&active=true`;
  
  try {
    console.log("[Test API] Fetching:", url);
    
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Orakel-Edge-Engine/1.0",
      },
    });
    
    const status = res.status;
    const statusText = res.statusText;
    const contentType = res.headers.get("content-type");
    
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    
    return NextResponse.json({
      success: res.ok,
      status,
      statusText,
      contentType,
      url,
      response: body,
      responseType: typeof body,
      isArray: Array.isArray(body),
      hasData: typeof body === "object" && body !== null && "data" in body,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      url,
    }, { status: 500 });
  }
}

