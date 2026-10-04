"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

const STARTER: Message = {
  role: "assistant",
  content:
    "Welcome to SanShuzz & Ma-Shirts. Ask me about caring for your clothes, shoes and bags, or about Santus Sabaoth and Sartorial Executive.",
};

/** Floating guide assistant. Lives on the house site; both brands link back to the Guide. */
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
      if (!res.ok) throw new Error("unavailable");
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setError("The assistant is unavailable right now. The Guide has the answers to most care questions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      {open && (
        <div
          className="mb-4 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-[22rem] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
          role="dialog"
          aria-label="Guide assistant"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <div className="font-display text-base text-fg">Guide assistant</div>
              <Link href="/guide" className="text-xs text-fg-muted/60 hover:text-accent">
                Browse the Guide
              </Link>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="text-fg-muted/60 hover:text-fg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="thin-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-accent text-bg" : "bg-bg text-fg-muted"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-fg-muted/50">Thinking…</div>}
            {error && (
              <div className="text-xs text-fg-muted/70">
                {error}{" "}
                <Link href="/guide" className="text-accent underline underline-offset-4">
                  Open the Guide
                </Link>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about suit care, leather, fit…"
              aria-label="Your question"
              className="flex-1 rounded-full border border-line bg-bg px-4 py-2 text-sm text-fg placeholder:text-fg-muted/40 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent-soft disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close guide assistant" : "Open guide assistant"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-bg shadow-lift transition hover:bg-accent-soft"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M4 5h16v10H8l-4 4V5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
