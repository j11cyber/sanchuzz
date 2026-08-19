import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import ServiceInquiryCta from "@/components/ServiceInquiryCta";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Wedding Attire",
  description: "Wedding attire planning for the couple and the wedding party.",
};

const coverage = [
  "Groom's attire — from traditional agbada to a tailored suit",
  "Bridal party coordination across multiple outfits and colors",
  "Traditional and white-wedding looks planned as one continuous story",
  "Fittings scheduled around the wedding timeline, with buffer for alterations",
];

export default function WeddingAttirePage() {
  return (
    <div>
      <ServiceHero
        eyebrow="Service"
        title="Wedding Attire"
        description="From the traditional ceremony to the reception, we plan attire for the couple and the party as one coordinated look."
        image="https://picsum.photos/seed/service-wedding/1800/1000"
      />
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <ScrollReveal>
          <h2 className="font-display text-2xl text-cream">What&rsquo;s covered</h2>
        </ScrollReveal>
        <ul className="mt-6 space-y-4">
          {coverage.map((c, i) => (
            <ScrollReveal key={c} delay={i * 80}>
              <li className="flex items-start gap-3 rounded-xl border border-charcoal-800 bg-charcoal-900 p-5 text-sm text-cream-dim/80 shadow-soft">
                <span className="mt-0.5 text-gold">✦</span>
                {c}
              </li>
            </ScrollReveal>
          ))}
        </ul>
        <div className="mt-14">
          <ServiceInquiryCta
            heading="Plan your wedding attire"
            body="Share your date and party size, and we'll put together a fitting timeline."
          />
        </div>
      </div>
    </div>
  );
}
