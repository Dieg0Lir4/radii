"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble, { Message } from "./MessageBubble";
import ChatInput from "./ChatInput";
import { sendMessage } from "@/services/chatService";
import { extractQuoteData } from "@/services/quoteService";
import { QuoteState, initialQuoteState } from "@/models/quoteState";

const initialMessages: Message[] = [
  { id: 1, sender: "assistant", text: "Hola, soy Radii. ¿En qué puedo ayudarte hoy?", time: "10:00" },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [quoteState, setQuoteState] = useState<QuoteState>(initialQuoteState);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleSend = async (text: string) => {
    const userMsg: Message = { id: Date.now(), sender: "user", text, time: getTime() };
    const updated = [...messages, userMsg];
    setMessages(updated);

    try {
      const reply = await sendMessage(updated);
      const withReply = [
        ...updated,
        { id: Date.now(), sender: "assistant" as const, text: reply, time: getTime() },
      ];
      setMessages(withReply);

      const updates = await extractQuoteData(withReply, quoteState);
      if (Object.keys(updates).length > 0) {
        setQuoteState((prev) => ({ ...prev, ...updates }));
        console.log("QuoteState actualizado:", { ...quoteState, ...updates });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "assistant", text: "Error al obtener respuesta.", time: getTime() },
      ]);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="flex items-center gap-3 bg-emerald-600 px-4 py-3 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold">
          R
        </div>
        <div>
          <p className="font-semibold">Radii</p>
          <p className="text-xs text-emerald-100">en línea</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mx-auto w-full max-w-2xl">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
