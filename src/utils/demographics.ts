
export function extractAgeGender(obj: any): { age: number | null, gender: string | null } {
  if (!obj || typeof obj !== "object") return { age: null, gender: null };

  let age: number | null = null;
  let gender: string | null = null;

  if (typeof obj.age === "number") age = Math.round(obj.age);
  else if (typeof obj.Age === "number") age = Math.round(obj.Age);
  else if (typeof obj.age_guess === "number") age = Math.round(obj.age_guess);
  else if (typeof obj.ageGuess === "number") age = Math.round(obj.ageGuess);

  if (typeof obj.gender === "string" && obj.gender.trim() !== "") gender = obj.gender[0].toUpperCase() + obj.gender.slice(1);
  else if (typeof obj.Gender === "string" && obj.Gender.trim() !== "") gender = obj.Gender[0].toUpperCase() + obj.Gender.slice(1);
  else if (typeof obj.gender_guess === "string" && obj.gender_guess.trim() !== "") gender = obj.gender_guess[0].toUpperCase() + obj.gender_guess.slice(1);
  else if (typeof obj.genderGuess === "string" && obj.genderGuess.trim() !== "") gender = obj.genderGuess[0].toUpperCase() + obj.genderGuess.slice(1);

  if (age !== null || gender !== null) {
    return { age, gender };
  }

  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      const nested = extractAgeGender(obj[key]);
      if (nested.age !== null && age === null) age = nested.age;
      if (nested.gender !== null && gender === null) gender = nested.gender;
    }
  }
  return { age, gender };
}
