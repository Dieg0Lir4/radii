import { NextRequest, NextResponse } from "next/server";
import * as pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const data = await pdf(buffer);
    return NextResponse.json({ text: data.text });
  } catch {
    return NextResponse.json({ error: "No se pudo leer el PDF" }, { status: 500 });
  }
}
