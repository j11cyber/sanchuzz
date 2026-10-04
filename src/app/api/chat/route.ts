import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { getActiveServices } from "@/lib/services";
import { formatNaira } from "@/lib/money";
import { ATELIER_LOCATION } from "@/lib/contact";

type ChatMessage = { role: "user" | "assistant"; content: string };

const BASE_PROMPT = `You are the guide assistant for SANSHUZZ & MA-SHIRTS, a menswear house in ${ATELIER_LOCATION}.

The house has two brands:
- SANTUS SABAOTH (/santus-sabaoth): the founder's own line. Tailoring, kaftans, agbada, shirts, shoes and bags, all made by him. A regular shop: browse, add to bag, pay with Paystack. Commissions for made-to-measure pieces at /santus-sabaoth/commission.
- SARTORIAL EXECUTIVE (/sartorial-executive): The Fashion Clinic. Tagline "Diagnose. Prescribe. Transform." Promise: "Become the Sartorial Executive." Paid styling services for executives, founders, lawyers and public figures, plus a curated edit of luxury pieces from him and other houses. Free online Executive Checkup at /sartorial-executive/checkup produces a Patient File and a recommended treatment. Case files at /sartorial-executive/case-files. Book at /sartorial-executive/book. Services are booked with a 50% deposit, balance before delivery, aftercare included. House calls available in Abuja.

The house site has the Guide (/guide): articles on caring for clothing, shoes and bags, wardrobe building, colour and fit. Your first job is to answer garment-care and style questions from that knowledge, plainly and specifically. Your second job is to point people to the right brand, page or service.

Tone: a top tailor talking. Short, confident, specific. No hype, no emoji, no medical jokes. Never invent prices or policies that are not listed here. If you do not know, say so and suggest WhatsApp via /contact.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "The assistant is offline at the moment. The Guide at /guide covers suit, shoe and bag care, and the Executive Checkup at /sartorial-executive/checkup is open.",
      },
      { status: 200 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-20);
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const [categories, services] = await Promise.all([
    prisma.guideArticle
      .findMany({ where: { published: true }, select: { category: true }, distinct: ["category"] })
      .then((rows) => rows.map((r) => r.category))
      .catch(() => [] as string[]),
    getActiveServices(),
  ]);

  const serviceLines = services.map(
    (s) => `- ${s.name}: ${formatNaira(s.price)}${s.duration ? `, ${s.duration}` : ""}. ${s.description}`,
  );

  const system = [
    BASE_PROMPT,
    serviceLines.length ? `\nSartorial Executive treatments:\n${serviceLines.join("\n")}` : "",
    categories.length ? `\nGuide topics currently published: ${categories.join(", ")}.` : "",
  ].join("\n");

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply = textBlock && textBlock.type === "text" ? textBlock.text : "";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json(
      {
        reply: "I cannot answer right now. The Guide at /guide covers most care questions, and you can reach the house via /contact.",
      },
      { status: 200 },
    );
  }
}
