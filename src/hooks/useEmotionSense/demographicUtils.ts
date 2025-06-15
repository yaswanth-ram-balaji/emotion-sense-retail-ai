
// Demographic extraction utils
import { extractAgeGender as deepExtract } from "@/utils/demographics";

export function extractDemographicsFromBackend(emotionData: any): { age: number | null, gender: string | null } {
  // Prefer root-level fields
  let age: number | null = null;
  let gender: string | null = null;
  if (typeof emotionData.age === "number" || typeof emotionData.age === "string") {
    age = Number(emotionData.age);
    if (Number.isNaN(age)) age = null;
  }
  if (typeof emotionData.gender === "string" && emotionData.gender.trim().length > 0) {
    gender = String(emotionData.gender);
  }
  // Fallback: recursively search
  if (age === null && (!gender || gender === "null" || gender === "None")) {
    const res = deepExtract(emotionData);
    age = res.age;
    gender = res.gender;
  }
  // Handle known null/none
  if (gender === "null" || gender === "None") gender = null;
  return { age, gender };
}
