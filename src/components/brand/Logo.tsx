/**
 * The house marks.
 *
 * Monogram: an S drawn in two strokes with a needle through it, inside a
 * ring. Pure paths, so it works as a favicon without webfonts.
 * Wordmarks: SVG text set in each brand's display face (loaded by next/font
 * on every page), so they scale cleanly and stay selectable for screen readers
 * through the title.
 */

export function Monogram({ className = "", title = "SanShuzz & Ma-Shirts" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.9" />
      <circle cx="32" cy="32" r="26.5" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.6 3.2" opacity="0.7" />
      {/* The S */}
      <path
        d="M42.5 22.5c-1.6-4.2-5.6-6.3-10.4-6.3-5.8 0-10.4 3.1-10.4 7.9 0 10.6 21.8 6.7 21.8 18 0 5.3-5 8.4-11.3 8.4-6.2 0-10.6-2.9-12.3-7.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* The needle */}
      <path d="M19.5 47.5 44.5 17" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="45.3" cy="16" rx="1.6" ry="2.6" transform="rotate(39 45.3 16)" fill="none" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

const display = { fontFamily: "var(--font-display)" } as const;
const body = { fontFamily: "var(--font-body)" } as const;

/** SanShuzz & Ma-Shirts. Height 1em of the parent font-size scales it. */
export function HouseWordmark({ className = "", withMark = true }: { className?: string; withMark?: boolean }) {
  return (
    <svg viewBox={withMark ? "0 0 420 56" : "0 0 356 56"} className={className} role="img" aria-label="SanShuzz & Ma-Shirts">
      <title>SanShuzz &amp; Ma-Shirts</title>
      {withMark && (
        <g transform="translate(0 4) scale(0.75)">
          <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.9" />
          <path d="M42.5 22.5c-1.6-4.2-5.6-6.3-10.4-6.3-5.8 0-10.4 3.1-10.4 7.9 0 10.6 21.8 6.7 21.8 18 0 5.3-5 8.4-11.3 8.4-6.2 0-10.6-2.9-12.3-7.6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M19.5 47.5 44.5 17" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      )}
      <text x={withMark ? 64 : 0} y="39" style={display} fontSize="38" fill="currentColor" letterSpacing="0.5">
        SanShuzz
        <tspan dx="10" fontStyle="italic" fontSize="34" fill="var(--brand-accent)">
          &amp;
        </tspan>
        <tspan dx="10">Ma-Shirts</tspan>
      </text>
    </svg>
  );
}

/** Santus Sabaoth: Cormorant, the second word italic, a bronze underscore. */
export function SantusWordmark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 56" className={className} role="img" aria-label="Santus Sabaoth">
      <title>Santus Sabaoth</title>
      <text x="0" y="38" style={display} fontSize="40" fontWeight="500" fill="currentColor" letterSpacing="-0.5">
        Santus
        <tspan dx="9" fontStyle="italic" fontWeight="400">
          Sabaoth
        </tspan>
      </text>
      <path d="M1 49h120" stroke="var(--brand-accent-dim)" strokeWidth="1" opacity="0.9" />
    </svg>
  );
}

/** Sartorial Executive: Playfair, spaced, with the clinic line beneath in Montserrat. */
export function SartorialWordmark({ className = "", withClinic = true }: { className?: string; withClinic?: boolean }) {
  return (
    <svg viewBox="0 0 360 56" className={className} role="img" aria-label="Sartorial Executive, The Fashion Clinic">
      <title>Sartorial Executive</title>
      <text x="0" y={withClinic ? 32 : 38} style={display} fontSize="30" fill="currentColor" letterSpacing="3">
        SARTORIAL EXECUTIVE
      </text>
      {withClinic && (
        <text x="1" y="50" style={body} fontSize="9.5" fill="var(--brand-accent)" letterSpacing="4">
          THE FASHION CLINIC
        </text>
      )}
    </svg>
  );
}
