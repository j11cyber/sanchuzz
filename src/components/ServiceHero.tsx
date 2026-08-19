import ScrollReveal from "@/components/ScrollReveal";
import ParallaxImage from "@/components/ParallaxImage";

export default function ServiceHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <section className="relative flex min-h-[56vh] items-end overflow-hidden">
      <ParallaxImage src={image} alt={title} fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/55 to-charcoal-950/15" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8">
        <ScrollReveal variant="3d">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl text-cream sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-dim/80">
            {description}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
