import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BRANDS, HOUSE_NAME } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";
import { HOUSE } from "@/lib/photos";

export const metadata: Metadata = {
  title: "About",
  description: `${HOUSE_NAME} is the house behind Santus Sabaoth and Sartorial Executive.`,
};

/**
 * About the house.
 * TODO(owner): replace the placeholder history with the real founding story.
 */
export default async function AboutHousePage() {
  const contact = await getContactSettings();

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <h1 className="max-w-4xl font-display text-5xl leading-[1.02] text-fg sm:text-7xl">
          The name on the bag.
        </h1>
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <p className="font-display text-2xl leading-snug text-fg lg:col-span-5">
            {HOUSE_NAME} is a menswear house in {contact.location}. Two labels live under it, and they start from opposite ends of the
            same question.
          </p>
          <div className="space-y-5 text-base leading-relaxed text-fg-muted/85 lg:col-span-5 lg:col-start-8">
            <p>
              <Link href={BRANDS.santus.prefix} className="border-b border-accent/60 text-fg transition hover:text-accent">
                Santus Sabaoth
              </Link>{" "}
              is the founder&rsquo;s own line: clothing, shoes and bags designed and made by one hand, sold ready to wear or cut to your
              measure.
            </p>
            <p>
              <Link href={BRANDS.sartorial.prefix} className="border-b border-accent/60 text-fg transition hover:text-accent">
                Sartorial Executive
              </Link>{" "}
              is The Fashion Clinic: a styling practice for executives, founders, lawyers and public figures. It diagnoses what is wrong
              with how a man dresses, prescribes the fix, and carries luxury pieces from the atelier and other houses.
            </p>
            <p>
              The house keeps the{" "}
              <Link href="/guide" className="border-b border-accent/60 text-fg transition hover:text-accent">
                Guide
              </Link>
              , plain advice on caring for clothing, shoes and bags, because the best thing you can do for a good garment is look after it.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-px bg-line sm:grid-cols-2">
        <div className="relative aspect-[4/5] bg-bg sm:aspect-auto sm:min-h-[70svh]">
          <Image src={HOUSE.aboutAtelier} alt="The atelier" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="relative aspect-[4/5] bg-bg sm:aspect-auto">
          <Image src={HOUSE.aboutKnit} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <h2 className="font-display text-4xl text-fg sm:text-5xl lg:col-span-5">How the two labels work together</h2>
          <dl className="divide-y divide-line border-y border-line lg:col-span-6 lg:col-start-7">
            <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
              <dt className="font-display text-xl text-fg">Make</dt>
              <dd className="text-sm leading-relaxed text-fg-muted/85">
                Santus Sabaoth cuts and finishes every piece in the line. Commissions are made the same way.
              </dd>
            </div>
            <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
              <dt className="font-display text-xl text-fg">Diagnose</dt>
              <dd className="text-sm leading-relaxed text-fg-muted/85">
                Sartorial Executive reads your proportions, your rooms and your position before a garment is chosen.
              </dd>
            </div>
            <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr]">
              <dt className="font-display text-xl text-fg">Keep</dt>
              <dd className="text-sm leading-relaxed text-fg-muted/85">
                The Guide and the aftercare in every treatment make sure what you own lasts.
              </dd>
            </div>
          </dl>
        </div>
        <p className="mt-12 text-xs text-fg-muted/50">Placeholder history. The founder&rsquo;s own account will replace this.</p>
      </section>
    </div>
  );
}
