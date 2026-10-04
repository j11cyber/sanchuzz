/** Options shared by the booking form (client) and the booking API (server). */

export const OCCASIONS = [
  { value: "boardroom", label: "Boardroom and everyday work" },
  { value: "wedding", label: "Wedding" },
  { value: "interview", label: "Interview or promotion" },
  { value: "keynote", label: "Pitch, keynote or media" },
  { value: "gala", label: "Gala or black tie" },
  { value: "wardrobe", label: "Whole wardrobe" },
] as const;

export type Occasion = (typeof OCCASIONS)[number]["value"];

export const FORMATS = ["In person at the atelier", "House call", "Virtual session"] as const;
export type BookingFormat = (typeof FORMATS)[number];

export function isOccasion(v: unknown): v is Occasion {
  return typeof v === "string" && OCCASIONS.some((o) => o.value === v);
}

export function isFormat(v: unknown): v is BookingFormat {
  return typeof v === "string" && (FORMATS as readonly string[]).includes(v);
}

export function occasionLabel(v: string | null | undefined): string {
  return OCCASIONS.find((o) => o.value === v)?.label ?? (v || "Not specified");
}

/** Deposit in naira. */
export function depositOf(s: { price: number; depositPercent: number }): number {
  return Math.round((s.price * s.depositPercent) / 100);
}

export type BookableService = { slug: string; name: string; price: number; depositPercent: number };

/** Request body for POST /api/book. */
export type BookRequest = {
  serviceSlug: string;
  occasion: string;
  name: string;
  email: string;
  phone: string;
  preferredDate?: string;
  format?: string;
  notes?: string;
  checkupRef?: string;
  /** true: create the deposit order and go to Paystack. false: save as an enquiry only. */
  pay: boolean;
};

/** Response from POST /api/book. */
export type BookResponse = {
  bookingReference: string;
  serviceName: string;
  price: number;
  depositAmount: number;
  balance: number;
  /** Set when pay was requested and Paystack is live. */
  authorizationUrl?: string;
  /** Set when pay was requested but Paystack is not configured. The booking is still saved. */
  paymentUnavailable?: boolean;
  message?: string;
};
