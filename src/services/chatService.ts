import { Message } from "@/components/MessageBubble";

export async function sendMessage(messages: Message[]): Promise<string> {
  const formatted = messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: formatted }),
  });

  if (!res.ok) {
    throw new Error("Error al comunicarse con Claude");
  }

  const data = await res.json();
  return data.text;
}
