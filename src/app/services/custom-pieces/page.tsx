import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import ServiceInquiryCta from "@/components/ServiceInquiryCta";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Custom Pieces",
  description: "Personalized, made-to-measure clothes, shoes, and bags.",
};

const categories = [
  { title: "Clothing", body: "Suits, kaftans, agbada, and shirting cut to your exact measurements." },
  { title: "Shoes", body: "Hand-lasted footwear built on a last unique to your foot." },
  { title: "Bags", body: "Structured or soft-construction bags in your choice of leather and hardware." },
];

export default function CustomPiecesPage() {
  return (
    <div>
      <ServiceHero
        eyebrow="Service"
        title="Custom Pieces"
        description="Personalized, made-to-measure clothes, shoes, and bags — built the same way Santus Sabaoth builds his own line."
        image="https://picsum.photos/seed/service-custom/1800/1000"
      />
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 90}>
              <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-7 shadow-soft">
                <h3 className="font-display text-lg text-cream">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim/70">{c.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={100}>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-cream-dim/70">
            Every custom order starts with a measurement session and a materials
            consultation, followed by a fitting before final construction.
            Timelines vary by piece — expect 3&ndash;8 weeks depending on
            complexity.
          </p>
        </ScrollReveal>
        <div className="mt-14">
          <ServiceInquiryCta
            heading="Start a custom order"
            body="Tell us what you'd like made, and we'll schedule a measurement consultation."
          />
        </div>
      </div>
    </div>
  );
}
