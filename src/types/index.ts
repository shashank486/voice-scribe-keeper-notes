
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  category?: string;
  language?: string;
}

export interface NewNote {
  title: string;
  content: string;
  isPinned?: boolean;
  category?: string;
  language?: string;
}

export type Category = "Work" | "Personal" | "Ideas" | "Reminders" | "Other";

export type SpeechLanguage = {
  code: string;
  name: string;
};

export const SPEECH_LANGUAGES: SpeechLanguage[] = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "hi-IN", name: "Hindi" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ar-SA", name: "Arabic" },
  { code: "ru-RU", name: "Russian" }
];

export const CATEGORIES: Category[] = ["Work", "Personal", "Ideas", "Reminders", "Other"];
