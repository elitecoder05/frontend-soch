import { AiModel, Category } from "@/types/model";

// This file intentionally contains no hard-coded models or categories.
// The app should fetch data from the backend API. Export empty arrays
// so existing imports won't break during the transition.

export const categories: Category[] = [
  { id: 'chatbots', slug: 'chatbots', name: 'Chatbots', description: 'Conversational AI and chat assistants', icon: 'MessageSquare', modelCount: 0 },
  { id: 'image', slug: 'image', name: 'Image', description: 'Image generation and editing models', icon: 'Image', modelCount: 0 },
  { id: 'code', slug: 'code', name: 'Code', description: 'Code generation and analysis models', icon: 'Code', modelCount: 0 },
  { id: 'productivity', slug: 'productivity', name: 'Productivity', description: 'Tools to boost productivity', icon: 'Zap', modelCount: 0 },
  { id: 'voice', slug: 'voice', name: 'Voice', description: 'Speech and voice-based models', icon: 'Mic', modelCount: 0 },
  { id: 'writing', slug: 'writing', name: 'Writing', description: 'Writing and editing models', icon: 'BookOpen', modelCount: 0 },
  { id: 'research', slug: 'research', name: 'Research', description: 'Research and analytics models', icon: 'Bot', modelCount: 0 },
  { id: 'agents', slug: 'agents', name: 'Agents', description: 'Agent-based automation models', icon: 'Bot', modelCount: 0 },
  { id: 'video', slug: 'video', name: 'Video', description: 'Video generation and editing', icon: 'Video', modelCount: 0 },
  { id: 'audio', slug: 'audio', name: 'Audio', description: 'Audio processing and generation', icon: 'Mic', modelCount: 0 },
  { id: 'data-analysis', slug: 'data-analysis', name: 'Data Analysis', description: 'Models for data analytics', icon: 'Zap', modelCount: 0 },
  { id: 'language', slug: 'language', name: 'Language', description: 'Translation and language models', icon: 'BookOpen', modelCount: 0 },
  { id: 'design', slug: 'design', name: 'Design', description: 'Design and creative models', icon: 'Palette', modelCount: 0 },
  { id: 'automation', slug: 'automation', name: 'Automation', description: 'Automation and workflow models', icon: 'Zap', modelCount: 0 },
  { id: 'healthcare', slug: 'healthcare', name: 'Healthcare', description: 'Healthcare and medical models', icon: 'Heart', modelCount: 0 },
  { id: 'education', slug: 'education', name: 'Education', description: 'Educational models', icon: 'BookOpen', modelCount: 0 },
  { id: 'marketing', slug: 'marketing', name: 'Marketing', description: 'Marketing and ad creation models', icon: 'Zap', modelCount: 0 },
  { id: 'finance', slug: 'finance', name: 'Finance', description: 'Finance and analysis models', icon: 'Zap', modelCount: 0 }
];

export const aiModels: AiModel[] = [];

// Small fetch helper (optional). Implement API calls in `src/api` instead.
export async function fetchModelsFromApi(): Promise<AiModel[]> {
  return [];
}
