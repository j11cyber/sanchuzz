import type { Metadata } from "next";
import ServiceHero from "@/components/ServiceHero";
import BodyTypeQuiz from "@/components/BodyTypeQuiz";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Body Type Styling",
  description: "A short questionnaire to find what suits your build.",
};

export default function BodyTypeStylingPage() {
  return (
    <div>
      <ServiceHero
        eyebrow="Service"
        title="Body Type Styling"
        description="Three quick questions to point you toward the cuts and proportions that suit your build."
        image="https://picsum.photos/seed/service-bodytype/1800/1000"
      />
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
        <ScrollReveal>
          <BodyTypeQuiz />
        </ScrollReveal>
      </div>
    </div>
  );
}
