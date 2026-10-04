import Image from "next/image";
import type { Metadata } from "next";
import { ATELIER_LOCATION, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Commission a piece",
  description: "Made-to-measure clothing, shoes and bags from Santus Sabaoth, built the same way he builds his own line.",
};

const CATEGORIES = [
  { title: "Clothing", body: "Suits, kaftans, agbada and shirting cut to your exact measurements." },
  { title: "Shoes", body: "Hand-lasted footwear built on a last made for your foot." },
  { title: "Bags", body: "Structured or soft construction, in your choice of leather and hardware." },
];

const STEPS = [
  { title: "Measure", body: "A measurement session at the atelier or at your home in Abuja. Virtual is possible for repeat clients." },
  { title: "Choose", body: "Cloth, leather, lining, hardware and details, decided together with samples in hand." },
  { title: "Fit", body: "A fitting before final construction. Two for a suit or a first pair of shoes." },
  { title: "Deliver", body: "Three to eight weeks depending on the piece. Care instructions come with it." },
];

export default function CommissionPage() {
  const message = "Hello Santus Sabaoth, I would like to commission a piece.";

  return (
    <div>
      <section className="relative flex min-h-[56vh] items-end overflow-hidden">
        <Image src="https://picsum.photos/seed/service-custom/1800/1000" alt="Cloth and tools on the cutting table" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/15" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
          <h1 className="font-display text-4xl text-fg sm:text-6xl">Commission a piece</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted/85">
            Clothing, shoes and bags made to your measure, the same way the line is made.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="rounded-2xl border border-line bg-surface p-7">
              <h2 className="font-display text-2xl text-fg">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted/70">{c.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 font-display text-3xl text-fg">How it works</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
              <div className="font-mono text-sm text-accent-dim">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-2 font-display text-xl text-fg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted/70">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-3xl border border-line bg-surface p-8 text-center sm:p-12">
          <h2 className="font-display text-3xl text-fg">Start a commission</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-fg-muted/70">
            Tell us what you would like made and we will arrange a measurement. {ATELIER_LOCATION}. House calls available.
          </p>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-block rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition hover:bg-accent-soft"
          >
            Message the atelier on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
