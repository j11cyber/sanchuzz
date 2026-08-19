import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ServiceHero from "@/components/ServiceHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Color of the Day",
  description: "A featured color to build today's look around.",
};

export default async function ColorOfTheDayPage() {
  const pick = await prisma.dailyPick.findFirst({
    where: { type: "COLOR" },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <ServiceHero
        eyebrow="Daily Pick"
        title="Color of the Day"
        description="One color, chosen daily, to anchor how you dress."
        image="https://picsum.photos/seed/service-color/1800/1000"
      />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {pick ? (
          <ScrollReveal>
            <div className="flex flex-col items-center gap-8 rounded-2xl border border-charcoal-800 bg-charcoal-900 p-10 text-center shadow-soft sm:flex-row sm:text-left">
              <div
                className="h-32 w-32 shrink-0 rounded-full border-4 border-charcoal-800 shadow-lift"
                style={{ backgroundColor: pick.colorHex ?? "#D4AF5A" }}
              />
              <div>
                <div className="text-xs uppercase tracking-widest text-gold">
                  {pick.colorHex}
                </div>
                <h2 className="mt-2 font-display text-2xl text-cream">{pick.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-cream-dim/75">
                  {pick.description}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <p className="text-center text-cream-dim/60">
            No color has been set yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
