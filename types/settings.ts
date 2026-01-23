export type SettingsTab = "profile" | "security" | "ai" | "billing" | "general";

export interface UserSettings {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  plan: string;
  role: string;
  aiTone?: "friendly" | "professional" | "luxury";
  bio?: string;
}
