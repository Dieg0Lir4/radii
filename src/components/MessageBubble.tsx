export interface Message {
  id: number;
  text: string;
  sender: "user" | "assistant";
  time: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isUser
            ? "rounded-br-sm bg-emerald-500 text-white"
            : "rounded-bl-sm bg-white text-gray-900 shadow-sm"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p
          className={`mt-1 text-right text-[11px] ${
            isUser ? "text-emerald-100" : "text-gray-400"
          }`}
        >
          {message.time}
        </p>
      </div>
    </div>
  );
}
