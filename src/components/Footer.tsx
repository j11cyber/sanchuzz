import Link from "next/link";

const columns = [
  {
    title: "Clinical Services",
    links: [
      { href: "/services#the-executive-checkup", label: "The Executive Checkup (₦50k)" },
      { href: "/services#the-wardrobe-detox", label: "The Wardrobe Detox (₦120k)" },
      { href: "/services#the-sartorial-prescription", label: "The Sartorial Prescription (₦250k)" },
      { href: "/services#the-boardroom-cure", label: "The Boardroom Cure (₦400k)" },
      { href: "/services#emergency-consultation", label: "Emergency Consultation (₦75k)" },
    ],
  },
  {
    title: "Case Files & Outcomes",
    links: [
      { href: "/case-files#case-07", label: "Case #07: Baggy Suit Syndrome" },
      { href: "/case-files#case-12", label: "Case #12: Boardroom Invisibility" },
      { href: "/case-files#case-03", label: "Case #03: Weekend Whiplash" },
      { href: "/case-files", label: "All Clinical Case Files" },
      { href: "/sartorial-executive", label: "The Sartorial Executive Blueprint" },
    ],
  },
  {
    title: "Prescription Shop",
    links: [
      { href: "/shop", label: "Full Catalogue" },
      { href: "/santus-sabaoth", label: "Santus Sabaoth Atelier" },
      { href: "/sartorial-executive", label: "Sartorial Executive Edit" },
      { href: "/prescription-pad", label: "The Prescription Pad" },
      { href: "/aftercare", label: "Garment Aftercare Guide" },
    ],
  },
  {
    title: "The Clinic",
    links: [
      { href: "/about", label: "Our Philosophy" },
      { href: "/executive-checkup", label: "Take Online Checkup" },
      { href: "/contact", label: "Lagos Atelier & Consultations" },
      { href: "/admin", label: "Admin Portal" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal-800 bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="font-display text-xl text-cream tracking-wide">
              THE FASHION CLINIC
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold font-medium">
              Diagnose &middot; Prescribe &middot; Transform
            </div>
            <p className="mt-4 text-xs leading-relaxed text-cream-dim/70">
              We diagnose fashion flaws. We prescribe. We transform men into the Sartorial Executive.
            </p>
            <div className="mt-6">
              <Link
                href="/executive-checkup"
                className="inline-block rounded-full bg-gold px-5 py-2 text-xs font-semibold text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
              >
                Book Checkup
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gold">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-xs text-cream-dim/75 transition hover:text-gold"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-charcoal-800 pt-8 text-xs text-cream-dim/50 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} THE FASHION CLINIC. All rights reserved.</span>
          <span className="text-center sm:text-right">
            Lagos, Nigeria &middot; Strictly for Sartorial Transformation
          </span>
        </div>
      </div>
    </footer>
  );
}
