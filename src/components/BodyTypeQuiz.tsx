"use client";

import { useState } from "react";
import Link from "next/link";

type Answers = { shoulders: string; waist: string; height: string };

type Result = {
  label: string;
  summary: string;
  tips: string[];
  shopHref: string;
};

const RESULTS: Record<string, Result> = {
  triangle: {
    label: "Broad Shoulders, Narrower Waist",
    summary:
      "Your shoulder line is your strongest asset. The goal is balance — don't over-structure the top half further.",
    tips: [
      "Single-breasted jackets with a soft shoulder — skip heavy padding",
      "Straight or slim-tapered trousers to keep the lower half proportional",
      "Avoid bulky layering on top; let the shoulder line speak for itself",
    ],
    shopHref: "/santus-sabaoth?category=Blazers",
  },
  rectangle: {
    label: "Balanced Shoulders and Waist",
    summary:
      "A balanced frame carries most silhouettes well — the opportunity is to add shape rather than correct it.",
    tips: [
      "Structured blazers with a defined waist to introduce shape",
      "Layer with a waistcoat or fitted knit under a jacket",
      "Experiment with pattern — this build carries it without distortion",
    ],
    shopHref: "/sartorial-executive",
  },
  oval: {
    label: "Fuller Through the Midsection",
    summary:
      "Vertical lines and a longer, unbroken silhouette are the most flattering direction here.",
    tips: [
      "Single-breasted jackets with a lower button stance to lengthen the torso",
      "Darker, monochrome combinations to create one continuous line",
      "Avoid horizontal breaks at the waist — belts and contrast waistbands work against you",
    ],
    shopHref: "/santus-sabaoth?category=Kaftans",
  },
  trapezoid: {
    label: "Athletic, Broad Through Chest and Shoulders",
    summary:
      "An athletic build carries tailoring exceptionally well — the risk is pieces that are cut too roomy and hide the frame.",
    tips: [
      "Slim through the body, roomy enough in the shoulder to move",
      "Open-neck shirts and unstructured jackets for off-duty pieces",
      "Well-fitted trousers — avoid anything that tapers too aggressively at the ankle",
    ],
    shopHref: "/sartorial-executive?brand=Santus%20Sabaoth",
  },
};

function computeResult(a: Answers): Result {
  if (a.shoulders === "broad" && a.waist === "narrow") return RESULTS.triangle;
  if (a.waist === "full") return RESULTS.oval;
  if (a.shoulders === "broad" && a.waist === "balanced") return RESULTS.trapezoid;
  return RESULTS.rectangle;
}

const QUESTIONS: {
  key: keyof Answers;
  question: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "shoulders",
    question: "How would you describe your shoulders relative to your waist?",
    options: [
      { value: "broad", label: "Noticeably broader than my waist" },
      { value: "even", label: "About the same width" },
    ],
  },
  {
    key: "waist",
    question: "How would you describe your midsection?",
    options: [
      { value: "narrow", label: "Narrow and defined" },
      { value: "balanced", label: "Balanced with my chest" },
      { value: "full", label: "Fuller than my chest and shoulders" },
    ],
  },
  {
    key: "height",
    question: "How tall are you?",
    options: [
      { value: "shorter", label: "Under 5'8\" / 173cm" },
      { value: "average", label: "5'8\"–6'0\" / 173–183cm" },
      { value: "taller", label: "Over 6'0\" / 183cm" },
    ],
  },
];

export default function BodyTypeQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});

  const done = step >= QUESTIONS.length;
  const result = done ? computeResult(answers as Answers) : null;

  function select(key: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  if (done && result) {
    return (
      <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-8 shadow-soft sm:p-10">
        <p className="text-xs uppercase tracking-widest text-gold">Your result</p>
        <h2 className="mt-3 font-display text-2xl text-cream">{result.label}</h2>
        <p className="mt-4 text-sm leading-relaxed text-cream-dim/75">{result.summary}</p>
        <ul className="mt-6 space-y-3">
          {result.tips.map((t) => (
            <li key={t} className="flex gap-3 text-sm text-cream-dim/80">
              <span className="text-gold">✦</span>
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={result.shopHref}
            className="rounded-full bg-gold px-6 py-3 text-sm font-medium text-charcoal-950 shadow-gold transition hover:bg-gold-soft"
          >
            Shop pieces for this build
          </Link>
          <button
            onClick={restart}
            className="rounded-full border border-charcoal-700 px-6 py-3 text-sm text-cream-dim transition hover:border-gold hover:text-gold"
          >
            Retake quiz
          </button>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];

  return (
    <div className="rounded-2xl border border-charcoal-800 bg-charcoal-900 p-8 shadow-soft sm:p-10">
      <div className="text-xs uppercase tracking-widest text-gold">
        Question {step + 1} of {QUESTIONS.length}
      </div>
      <h2 className="mt-3 font-display text-xl text-cream">{q.question}</h2>
      <div className="mt-6 space-y-3">
        {q.options.map((o) => (
          <button
            key={o.value}
            onClick={() => select(q.key, o.value)}
            className="block w-full rounded-xl border border-charcoal-700 px-5 py-3.5 text-left text-sm text-cream-dim transition hover:border-gold hover:bg-charcoal-800 hover:text-cream"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
