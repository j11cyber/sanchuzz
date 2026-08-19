export type CheckupFormData = {
  name: string;
  email: string;
  phone: string;
  profession: string;
  industry: string;
  roleLevel: string;
  workEnvironment: string;
  travelFrequency: string;
  chiefComplaint: string;
  colorPreference: string;
  fitProblem: string;
  transformationGoal: string;
};

export type PatientFileResult = {
  patientRef: string;
  patientName: string;
  profession: string;
  industry: string;
  date: string;
  chiefComplaint: string;
  clinicalDiagnosis: string;
  symptoms: string[];
  prescriptionRx: string[];
  treatmentPlan: {
    serviceName: string;
    serviceSlug: string;
    priceNaira: number;
    timeline: string;
    description: string;
  };
  recommendedProductsSlugs: string[];
  consultantSignoff: string;
};

export function evaluateCheckupDiagnosis(data: CheckupFormData): PatientFileResult {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const patientRef = `TFC-${randomNum}`;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let clinicalDiagnosis = "Proportional misalignment with acute visual dilution under executive lighting.";
  const symptoms: string[] = [];
  const prescriptionRx: string[] = [];
  let serviceName = "The Executive Checkup";
  let serviceSlug = "the-executive-checkup";
  let priceNaira = 50000;
  let timeline = "30-minute diagnosis";
  let description = "Comprehensive full-body proportion and personal brand assessment to establish your baseline style blueprint.";
  let recommendedProductsSlugs = ["obsidian-tailored-blazer", "charcoal-wool-trousers", "gold-stitched-oxford-shirt"];

  // Logic based on chief complaint and role level
  if (data.chiefComplaint === "baggy_suits" || data.fitProblem === "excess_fabric") {
    clinicalDiagnosis = "Acute Baggy Suit Syndrome: Off-the-rack scaling failure with shoulder seam collapse and multiple trouser breaks, causing visual stature truncation.";
    symptoms.push("Shoulder seam overhang past acromion point");
    symptoms.push("Unanchored sleeve drape hiding shirt cuffs");
    symptoms.push("Excess trouser pooling diminishing height and executive presence");
    prescriptionRx.push("Rx 1: Transition to soft-canvassed Italian wool blazers cut precisely to natural shoulder width.");
    prescriptionRx.push("Rx 2: Taper trousers to a clean single or no-break hemline.");
    prescriptionRx.push("Rx 3: Standardize sleeve pitch to expose exactly 1/2 inch of linen/cotton cuff.");
    prescriptionRx.push("Rx 4: Eliminate horizontal waist breaks with clean concealed hook tab closures.");
    prescriptionRx.push("Rx 5: Integrate structured dark charcoal and midnight navy foundations.");
    serviceName = "The Wardrobe Detox";
    serviceSlug = "the-wardrobe-detox";
    priceNaira = 120000;
    timeline = "Half-Day Intensive";
    description = "Audit every existing suit and trouser in your closet to separate keepable garments from those requiring immediate tailoring or replacement.";
    recommendedProductsSlugs = ["obsidian-tailored-blazer", "charcoal-wool-trousers", "milano-two-piece-suit"];
  } else if (data.chiefComplaint === "decision_fatigue" || data.chiefComplaint === "full_closet_nothing_to_wear") {
    clinicalDiagnosis = "Weekend-to-Workwear Whiplash: High garment entropy resulting from disparate single-item purchases without a governing modular wardrobe matrix.";
    symptoms.push("Over 30 minutes lost to morning outfit selection");
    symptoms.push("High proportion of single-use garments that resist pairing");
    symptoms.push("Inconsistent formality transitions between office and evening events");
    prescriptionRx.push("Rx 1: Establish a 10-piece foundational capsule with a 20+ outfit combination yield.");
    prescriptionRx.push("Rx 2: Calibrate base palette to Midnight Navy, Charcoal, Ivory, and Warm Gold accents.");
    prescriptionRx.push("Rx 3: Introduce multi-functional pieces: unstructured blazers and luxury raw silk kaftans.");
    prescriptionRx.push("Rx 4: Standardize footwear into two versatile silhouettes: Goodyear-welted Oxfords and hand-lasted leather loafers.");
    prescriptionRx.push("Rx 5: Implement weekly 7-outfit lookbook rotation to eliminate daily cognitive load.");
    serviceName = "The Sartorial Prescription";
    serviceSlug = "the-sartorial-prescription";
    priceNaira = 250000;
    timeline = "7 Outfits / 2-Week Concierge Support";
    description = "Complete 7-day style blueprint engineered around 12 core pieces, digital lookbook, and continuous WhatsApp advisory.";
    recommendedProductsSlugs = ["sabaoth-signature-kaftan", "gold-stitched-oxford-shirt", "handcrafted-leather-loafers", "sartorial-signature-overcoat"];
  } else if (data.chiefComplaint === "lack_of_authority" || data.roleLevel === "c_suite" || data.roleLevel === "founder") {
    clinicalDiagnosis = "Boardroom Invisibility Syndrome: Defensively muted dressing style lacking distinctive visual weight and non-verbal executive authority.";
    symptoms.push("Visual blending with subordinate staff in high-stakes meetings");
    symptoms.push("Diminished initial perception during pitches, keynotes, and media appearances");
    symptoms.push("Absence of intentional fabric texture, tailoring drape, and signature accessories");
    prescriptionRx.push("Rx 1: Deploy high-contrast, disciplined monochromatic executive suiting (Super-120s wool & cashmere blend).");
    prescriptionRx.push("Rx 2: Incorporate tactile depth: brushed wool overcoats and mulberry silk placket evening shirts.");
    prescriptionRx.push("Rx 3: Anchor with one signature power accessory: gunmetal crocodile-embossed belt or polished onyx cufflinks.");
    prescriptionRx.push("Rx 4: Align executive footwear with hand-finished whole-cut patinas.");
    prescriptionRx.push("Rx 5: Curate a structured leather attaché briefcase for boardroom presentations.");
    serviceName = "The Boardroom Cure";
    serviceSlug = "the-boardroom-cure";
    priceNaira = 400000;
    timeline = "30-Day Executive Presence Transformation";
    description = "Holistic 30-day transformation covering bespoke tailoring, outfit curation for key milestones, grooming protocols, and 1-on-1 executive coaching.";
    recommendedProductsSlugs = ["sartorial-signature-overcoat", "milano-two-piece-suit", "whole-cut-oxford-shoe", "executive-attache-briefcase", "cufflink-set-onyx-gold"];
  } else if (data.transformationGoal === "urgent_event" || data.chiefComplaint === "upcoming_event") {
    clinicalDiagnosis = "Acute Event Styling Emergency: Time-critical milestone with uncoordinated wardrobe and unverified fit tolerances.";
    symptoms.push("Impending keynote, wedding, pitch, or gala within 72 hours");
    symptoms.push("Uncertain dress code compliance and accessorization");
    symptoms.push("Risk of ill-timed fashion blunder in high-visibility environment");
    prescriptionRx.push("Rx 1: Immediate event dress code triage and silhouette selection.");
    prescriptionRx.push("Rx 2: Fast-track tailoring inspection and garment steaming/finishing.");
    prescriptionRx.push("Rx 3: Coordinated accessory and footwear alignment.");
    prescriptionRx.push("Rx 4: Emergency grooming & posture check.");
    prescriptionRx.push("Rx 5: Final pre-event visual clearance.");
    serviceName = "Emergency Consultation";
    serviceSlug = "emergency-consultation";
    priceNaira = 75000;
    timeline = "24-Hour Rapid Turnaround";
    description = "Instant 24-hour style triage and execution for your upcoming high-stakes appearance.";
    recommendedProductsSlugs = ["obsidian-tailored-blazer", "sartorial-silk-evening-shirt", "whole-cut-oxford-shoe"];
  } else {
    // Default general diagnosis
    symptoms.push("Sub-optimal fit proportions across daily rotation");
    symptoms.push("Color undertones not harmonized with natural complexion");
    symptoms.push("Under-utilized wardrobe potential");
    prescriptionRx.push("Rx 1: Precision anatomical measurement and shoulder line baseline audit.");
    prescriptionRx.push("Rx 2: Restructure color hierarchy around warm gold, deep charcoal, and midnight navy.");
    prescriptionRx.push("Rx 3: Upgrade key touchpoints: tailored jacket, crisp Oxford shirts, and artisan leather loafers.");
    prescriptionRx.push("Rx 4: Implement 2-day garment rest cycle to preserve natural wool fibers.");
    prescriptionRx.push("Rx 5: Establish seasonal wardrobe audit schedule.");
  }

  return {
    patientRef,
    patientName: data.name || "Executive Client",
    profession: data.profession || "Executive / Founder",
    industry: data.industry || "Corporate & Finance",
    date: today,
    chiefComplaint: data.chiefComplaint.replace(/_/g, " ").toUpperCase(),
    clinicalDiagnosis,
    symptoms,
    prescriptionRx,
    treatmentPlan: {
      serviceName,
      serviceSlug,
      priceNaira,
      timeline,
      description,
    },
    recommendedProductsSlugs,
    consultantSignoff: "Lead Sartorial Consultant, The Fashion Clinic",
  };
}
