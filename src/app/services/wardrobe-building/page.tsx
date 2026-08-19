import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import ServiceInquiryCta from "@/components/ServiceInquiryCta";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Wardrobe Building",
  description: "Build out a wardrobe to whatever extent you need.",
};

const stages = [
  {
    title: "Assess",
    body: "A review of what you already own, what fits, and what's worth keeping — so nothing is duplicated.",
  },
  {
    title: "Define",
    body: "We map out the wardrobe to your life: work, formal occasions, travel, everyday — at whatever scope you need, from a ten-piece capsule to a full closet.",
  },
  {
    title: "Build",
    body: "Pieces are sourced across Santus Sabaoth and Sartorial Executive, sequenced so each purchase works with what came before.",
  },
  {
    title: "Maintain",
    body: "Ongoing check-ins as your needs change, plus care guidance from the Management Guide to keep everything in shape.",
  },
];

export default function WardrobeBuildingPage() {
  return (
    <div>
      <ServiceHero
        eyebrow="Service"
        title="Wardrobe Building"
        description="Whether you're starting from nothing or refining what you have, we build a wardrobe around your life — to whatever extent you need."
        image="https://picsum.photos/seed/service-wardrobe/1800/1000"
      />
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {stages.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 90}>
              <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-7 shadow-soft">
                <div className="text-xs uppercase tracking-widest text-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-2 font-display text-lg text-cream">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim/70">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-14">
          <ServiceInquiryCta />
        </div>
      </div>
    </div>
  );
}
