"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

const STARTER: Message = {
  role: "assistant",
  content:
    "Welcome to The Fashion Clinic. I'm your digital Sartorial Consultant. Whether you have a fit problem, need dress-code triage, or want guidance on our clinical styling services and prescriptions, how may I assist you today?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([STARTER]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((m) => m !== STARTER) }),
      });
      if (!res.ok) throw new Error("The consultation assistant is unavailable right now.");
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setError("The clinic assistant is currently occupied. You can book an Executive Checkup directly or explore our Case Files.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {open && (
        <div className="mb-4 flex h-[28rem] w-[20rem] flex-col overflow-hidden rounded-2xl border border-charcoal-700 bg-charcoal-900 shadow-lift sm:w-[22rem]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-charcoal-800 bg-navy-950 px-4 py-3">
            <div>
              <div className="flex items-center gap-1.5 font-display text-sm text-cream">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Clinic Sartorial Consultant
              </div>
              <div className="text-[10px] text-cream-dim/60">Style Diagnosis &amp; Prescriptions</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close consultation chat"
              className="text-cream-dim/70 hover:text-gold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="thin-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-gold text-charcoal-950 font-medium"
                    : "bg-charcoal-800 text-cream-dim border border-charcoal-700/50"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[75%] rounded-xl bg-charcoal-800 px-3.5 py-2.5 text-xs text-cream-dim/60">
                Formulating diagnosis&hellip;
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-950/40 p-2.5 text-xs text-red-300 border border-red-800/40">
                {error}
                <div className="mt-2">
                  <Link
                    href="/executive-checkup"
                    onClick={() => setOpen(false)}
                    className="underline text-gold hover:text-gold-soft"
                  >
                    Take online checkup →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-charcoal-800 p-3 bg-charcoal-950">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about fit, services, dress codes..."
              className="flex-1 rounded-full border border-charcoal-700 bg-charcoal-900 px-3.5 py-2 text-xs text-cream placeholder:text-cream-dim/40 focus:border-gold focus:outline-none"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="rounded-full bg-gold px-3.5 py-2 text-xs font-semibold text-charcoal-950 transition hover:bg-gold-soft disabled:opacity-40"
            >
              Consult
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-charcoal-950 shadow-gold transition hover:scale-105"
        aria-label="Open clinic assistant"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] font-black tracking-tighter">Rx</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="-mt-1">
              <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H3l2.2-3.7A8.5 8.5 0 1 1 21 11.5z" />
            </svg>
          </div>
        )}
      </button>
    </div>
  );
}
