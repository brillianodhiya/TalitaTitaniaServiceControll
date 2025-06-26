import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  // Lakukan sesuatu dengan data, misal simpan ke database/log
  console.log("DM dari bot:", data);
  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
}
