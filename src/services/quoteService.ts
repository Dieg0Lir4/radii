import { Message } from "@/components/MessageBubble";
import { QuoteState } from "@/models/quoteState";

export async function extractQuoteData(
  messages: Message[],
  currentState: QuoteState
): Promise<Partial<QuoteState>> {
  const formatted = messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  const res = await fetch("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: formatted, currentState }),
  });

  if (!res.ok) return {};

  const data = await res.json();
  return data.updates;
}
