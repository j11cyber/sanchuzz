import type { Metadata } from "next";
import { getActiveServices } from "@/lib/services";
import ExecutiveCheckup from "@/components/clinic/ExecutiveCheckup";

export const metadata: Metadata = {
  title: "The Executive Checkup",
  description:
    "Five questions, one Patient File. The Fashion Clinic's free online checkup diagnoses how you dress and prescribes the treatment that fits.",
};

export default async function CheckupPage() {
  const services = await getActiveServices();
  return <ExecutiveCheckup services={services.map((s) => ({ slug: s.slug, name: s.name, price: s.price }))} />;
}
