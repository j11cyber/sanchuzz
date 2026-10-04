import { prisma } from "@/lib/prisma";

export type ServiceItemType = {
  id: string;
  slug: string;
  name: string;
  price: number;
  /** Percentage of price paid to book. */
  depositPercent: number;
  duration?: string | null;
  description: string;
  features: string[];
  bestFor: string;
  image?: string | null;
  order: number;
  active: boolean;
};

/** Deposit in naira for a service. */
export function depositFor(service: Pick<ServiceItemType, "price" | "depositPercent">): number {
  return Math.round((service.price * service.depositPercent) / 100);
}

export async function getActiveServices(): Promise<ServiceItemType[]> {
  try {
    const services = await prisma.serviceItem.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    return services.map((s) => ({ ...s, features: safeParseArray(s.features) }));
  } catch (err) {
    console.error("Error loading services:", err);
    return [];
  }
}

export async function getAllServicesAdmin(): Promise<ServiceItemType[]> {
  try {
    const services = await prisma.serviceItem.findMany({ orderBy: { order: "asc" } });
    return services.map((s) => ({ ...s, features: safeParseArray(s.features) }));
  } catch (err) {
    console.error("Error loading all services:", err);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceItemType | null> {
  try {
    const service = await prisma.serviceItem.findUnique({ where: { slug } });
    if (!service) return null;
    return { ...service, features: safeParseArray(service.features) };
  } catch (err) {
    console.error("Error loading service by slug:", err);
    return null;
  }
}

function safeParseArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
