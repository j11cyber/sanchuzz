"use server";

import { prisma } from "@/lib/prisma";
import { evaluateCheckupDiagnosis, type CheckupFormData, type PatientFileResult } from "@/lib/checkup";

const MAX = 200;

function clean(value: unknown, max = MAX): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Run the diagnosis on the server and save every completed checkup.
 *
 * Public action (no admin session): the visitor is the patient. Inputs are
 * trimmed and length-capped; the diagnosis engine only ever reads from a
 * fixed set of option values, so unexpected strings fall through to the
 * default diagnosis rather than breaking anything.
 */
export async function submitCheckupAction(raw: CheckupFormData): Promise<PatientFileResult> {
  const data: CheckupFormData = {
    name: clean(raw.name, 120),
    email: clean(raw.email, 200),
    phone: clean(raw.phone, 40),
    profession: clean(raw.profession),
    industry: clean(raw.industry),
    roleLevel: clean(raw.roleLevel, 60),
    workEnvironment: clean(raw.workEnvironment),
    travelFrequency: clean(raw.travelFrequency),
    chiefComplaint: clean(raw.chiefComplaint, 60),
    colorPreference: clean(raw.colorPreference),
    fitProblem: clean(raw.fitProblem, 60),
    transformationGoal: clean(raw.transformationGoal, 60),
  };

  if (!data.name || !data.email || !data.phone) {
    throw new Error("Name, email and phone are required.");
  }

  // Up to five tries for a unique #TFC-XXXX reference, then widen.
  let result = evaluateCheckupDiagnosis(data);
  for (let attempt = 0; attempt < 6; attempt++) {
    if (attempt === 5) result = { ...result, patientRef: `TFC-${Date.now().toString(36).toUpperCase().slice(-6)}` };
    const exists = await prisma.checkupSubmission.findUnique({ where: { patientRef: result.patientRef }, select: { id: true } });
    if (!exists) break;
    result = evaluateCheckupDiagnosis(data);
  }

  await prisma.checkupSubmission.create({
    data: {
      patientRef: result.patientRef,
      name: data.name,
      email: data.email,
      phone: data.phone,
      occupation: data.profession || null,
      industry: data.industry || null,
      workEnvironment: data.workEnvironment || null,
      chiefComplaint: data.chiefComplaint,
      answers: JSON.stringify(data),
      diagnosis: result.clinicalDiagnosis,
      symptoms: JSON.stringify(result.symptoms),
      prescription: JSON.stringify(result.prescriptionRx),
      recommendedService: result.treatmentPlan.serviceSlug,
    },
  });

  return result;
}
