/**
 * Curated placeholder photography.
 *
 * Every image was looked at and chosen for mood: dark, warm, menswear and
 * tailoring. All are Unsplash photos under the Unsplash License (free for
 * commercial use, no attribution required). They are placeholders.
 *
 * TODO: real photo. Replace each entry with house photography on Supabase
 * Storage before launch; the keys are stable so only this file changes.
 */

function unsplash(id: string, w = 2000) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const PHOTOS = {
  /** Man in a checked suit inside a workshop, warm low light. */
  atelierCheckSuit: unsplash("1521341057461-6eb5f40b07ab"),
  /** Grey windowpane suit with black bow tie on a form, warm wood behind. */
  windowpaneBowTie: unsplash("1600091166971-7f9faad6c1e2"),
  /** Dark suit, deep red tie, arms folded, moody evening street. */
  darkSuitRedTie: unsplash("1519085360753-af0119f7cbe7"),
  /** Black suit and tie on a form against a brick wall. */
  blackSuitBrick: unsplash("1598808503746-f34c53b9323e"),
  /** Navy suit, buttoning the jacket, stairway behind. */
  navyButtoning: unsplash("1507679799987-c73779587ccf"),
  /** Man in a navy turtleneck and beret, warm brown backdrop. */
  beretPortrait: unsplash("1531384441138-2736e62e0919"),
  /** Man in a charcoal shawl-collar knit, black background. */
  shawlKnit: unsplash("1506794778202-cad84cf45f1d"),
  /** Man in a burgundy crew-neck knit, grey studio. */
  burgundyKnit: unsplash("1506634572416-48cdfe530110"),
  /** Man adjusting a black suit jacket, pale background. */
  adjustingJacket: unsplash("1544022613-e87ca75a784a"),
  /** Tan leather Oxford shoes, close. */
  tanOxfords: unsplash("1614252235316-8c857d38b5f4"),
  /** Grey double-breasted pinstripe, outdoors in autumn. */
  pinstripeDB: unsplash("1480429370139-e0132c086e2a"),
  /** Flat lay: dark denim, shirt and tie, tan jacket, brogues. */
  flatLay: unsplash("1593030761757-71fae45fa0e7"),
  /** Garments hanging behind glass in warm light. */
  hangingWarm: unsplash("1445205170230-053b83016050"),
  /** Black suit, sunglasses, city street. */
  blackSuitStreet: unsplash("1617127365659-c47fa864d8bc"),
} as const;

export type PhotoKey = keyof typeof PHOTOS;
