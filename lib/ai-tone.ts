export const AI_TONES = ["professional", "friendly", "luxury"] as const;

export type AiTone = (typeof AI_TONES)[number];

export const DEFAULT_AI_TONE: AiTone = "professional";

export const AI_TONE_INSTRUCTIONS: Record<AiTone, string> = {
  professional: "ტონი: ფორმალური, მკაფიო და ბიზნესორიენტირებული.",
  friendly: "ტონი: თბილი, მოსაწვევი და საუბრის სტილის.",
  luxury: "ტონი: დახვეწილი, ელეგანტური და მაღალი კლასის.",
};

export function isAiTone(value: unknown): value is AiTone {
  return (
    typeof value === "string" && (AI_TONES as readonly string[]).includes(value)
  );
}
