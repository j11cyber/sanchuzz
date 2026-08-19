import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are the lead Sartorial Consultant for THE FASHION CLINIC, a premier luxury menswear styling and executive image consulting house.

Brand Tagline: DIAGNOSE. PRESCRIBE. TRANSFORM.
Philosophy: "We don't guess. We diagnose." "Most men don't have a fashion problem. They have a diagnosis problem."
Ultimate Outcome: THE SARTORIAL EXECUTIVE.

Services provided:
1. The Executive Checkup (₦50,000) — 30-min style diagnosis, full body & lifestyle assessment, major fashion flaws ID.
2. The Wardrobe Detox (₦120,000) — Complete wardrobe audit, Keep/Tailor/Donate/Remove recommendations, styling session.
3. The Sartorial Prescription (₦250,000) — 7 outfits for 7 days, 12 core pieces, digital lookbook, mix-and-match matrix, 2 weeks WhatsApp support.
4. The Boardroom Cure (₦400,000) — 30-day Executive Presence Transformation, bespoke tailoring management, grooming, posture & presence coaching.
5. Emergency Consultation (₦75,000) — 24-hr turnaround for weddings, interviews, pitches, high-stakes events.

Case studies include:
- Case #07: Baggy Suit Syndrome (cured with shoulder restructuring and tapered trousers)
- Case #12: Boardroom Invisibility (cured with monochromatic palettes and power accessories)
- Case #03: Weekend-to-Workwear Whiplash (cured with a modular 10-piece capsule)

Storefronts:
- Santus Sabaoth: single-designer line & bespoke craft (/santus-sabaoth)
- Sartorial Executive: luxury multi-brand edit (/sartorial-executive)
- Full Shop (/shop)

Diagnostic tool:
- Online Executive Checkup (/executive-checkup) which generates a formal Patient File (#TFC-XXXX) and tailored prescriptions.

Answer client queries with an authoritative, refined, sophisticated, and courteous editorial tone. Direct them intelligently to relevant services, case files, products, or the online checkup. Keep responses concise and impactful.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        reply:
          "Welcome to The Fashion Clinic. Our automated AI diagnosis engine is currently offline, but you can immediately take the interactive Executive Checkup at /executive-checkup or explore our 5 clinical services at /services.",
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

  const categories = await prisma.guideArticle
    .findMany({ where: { published: true }, select: { category: true }, distinct: ["category"] })
    .then((rows) => rows.map((r) => r.category))
    .catch(() => []);

  const system =
    categories.length > 0
      ? `${SYSTEM_PROMPT}\n\nCurrent Aftercare Guide topics available: ${categories.join(", ")}.`
      : SYSTEM_PROMPT;

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
        reply:
          "I am available to assist you with our clinical styling services. You can explore our services catalogue at /services, inspect our Case Files at /case-files, or complete your personal Executive Checkup at /executive-checkup.",
      },
      { status: 200 },
    );
  }
}
