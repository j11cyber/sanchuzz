import Link from "next/link";
import type { Metadata } from "next";
import { BRANDS, HOUSE_NAME } from "@/lib/brands";
import { getContactSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "About",
  description: `${HOUSE_NAME} is the house behind Santus Sabaoth and Sartorial Executive.`,
};

/**
 * About the house.
 * TODO(owner): replace placeholder history with the real founding story.
 */
export default async function AboutHousePage() {
  const contact = await getContactSettings();
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="font-display text-4xl text-fg sm:text-6xl">{HOUSE_NAME}</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-fg-muted/85 sm:text-base">
        <p>
          {HOUSE_NAME} is a menswear house in {contact.location}. It is the name on the bag, and the home of two labels that approach
          dressing well from opposite ends.
        </p>
        <p>
          <Link href={BRANDS.santus.prefix} className="text-accent underline underline-offset-4">
            Santus Sabaoth
          </Link>{" "}
          is the founder&rsquo;s own line: clothing, shoes and bags designed and made by one hand, sold ready to wear or cut to your
          measure.
        </p>
        <p>
          <Link href={BRANDS.sartorial.prefix} className="text-accent underline underline-offset-4">
            Sartorial Executive
          </Link>{" "}
          is The Fashion Clinic: a styling practice for executives, founders, lawyers and public figures. It diagnoses what is wrong
          with how a man dresses, prescribes the fix, and carries luxury pieces from the atelier and other houses.
        </p>
        <p>
          The house itself keeps the{" "}
          <Link href="/guide" className="text-accent underline underline-offset-4">
            Guide
          </Link>
          , plain advice on caring for clothing, shoes and bags, because the best thing you can do for a good garment is look after it.
        </p>
        <p className="text-xs text-fg-muted/50">Placeholder history. The founder&rsquo;s own account will replace this.</p>
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link href={BRANDS.santus.prefix} className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition hover:bg-accent-soft">
          Santus Sabaoth
        </Link>
        <Link href={BRANDS.sartorial.prefix} className="rounded-full border border-line px-7 py-3.5 text-sm text-fg transition hover:border-accent hover:text-accent">
          Sartorial Executive
        </Link>
      </div>
    </div>
  );
}
