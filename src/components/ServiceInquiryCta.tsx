import ScrollReveal from "@/components/ScrollReveal";

export default function ServiceInquiryCta({
  heading = "Ready to begin?",
  body = "Tell us a little about what you're looking for and a member of the team will follow up.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <ScrollReveal>
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-8 text-center shadow-soft sm:p-12">
        <h2 className="font-display text-2xl text-cream">{heading}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-cream-dim/70">{body}</p>
        <a
          href="mailto:concierge@sanshuzzmashirts.com"
          className="mt-7 inline-block rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-charcoal-950 shadow-gold transition hover:scale-[1.02] hover:bg-gold-soft"
        >
          Email the concierge
        </a>
      </div>
    </ScrollReveal>
  );
}
