import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages, currentState } = await req.json();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 512,
      system: `Eres un extractor de datos. A partir de la conversación, extrae información relevante para una cotización de piezas industriales.

Estado actual:
${JSON.stringify(currentState)}

Devuelve SOLO un JSON con los campos que tengan nueva información. Campos posibles:
- tipoPieza (string)
- material (string)
- dimensiones (string)
- cantidad (number)
- toleranciasAcabados (string)
- urgencia (string)
- industria (string)

Si no hay información nueva, devuelve {}. No incluyas explicaciones, solo el JSON.`,
      messages,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();
  const text = data.content[0].text;

  try {
    const extracted = JSON.parse(text);
    return NextResponse.json({ updates: extracted });
  } catch {
    return NextResponse.json({ updates: {} });
  }
}
