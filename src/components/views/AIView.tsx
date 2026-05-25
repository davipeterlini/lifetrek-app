import React, { useState } from "react";
import { Sparkles, Send, User, Bot, Lightbulb, Heart, Activity, Moon } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  icon?: React.ReactNode;
}

const quickPrompts = [
  { icon: <Activity size={16} />, text: "Create a workout plan" },
  { icon: <Moon size={16} />, text: "Improve my sleep quality" },
  { icon: <Heart size={16} />, text: "Manage stress better" },
  { icon: <Lightbulb size={16} />, text: "Nutrition tips for today" },
];

export const AIView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Dr. Gemma, your AI health coach. How can I help you today?",
      icon: <Bot size={20} className="text-teal-400" />,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Based on your recent activity data, I recommend adding more protein to your diet. Your sleep quality has been good at 82%, but try to maintain a consistent bedtime. Would you like me to create a personalized meal plan?",
        icon: <Sparkles size={20} className="text-indigo-400" />,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          AI Health Coach
        </h1>
        <p className="text-gray-400 text-sm mt-1">Get personalized health insights and recommendations</p>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInput(prompt.text)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-gray-400 text-sm hover:bg-white/[0.06] hover:text-white transition-all"
          >
            {prompt.icon}
            {prompt.text}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`p-2 rounded-full ${
                msg.role === "user" ? "bg-teal-500/20" : "bg-gray-700/50"
              }`}
            >
              {msg.role === "user" ? (
                <User size={20} className="text-teal-400" />
              ) : (
                msg.icon
              )}
            </div>
            <div
              className={`max-w-[70%] p-4 rounded-xl ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                  : "bg-white/[0.05] border border-white/[0.05] text-gray-200"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="p-2 rounded-full bg-gray-700/50">
              <Bot size={20} className="text-teal-400" />
            </div>
            <div className="bg-white/[0.05] border border-white/[0.05] p-4 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about your health, nutrition, workouts..."
          className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};