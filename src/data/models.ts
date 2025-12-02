import { AiModel, Category } from "@/types/model";

// This file intentionally contains no hard-coded models or categories.
// The app should fetch data from the backend API. Export empty arrays
// so existing imports won't break during the transition.

export const categories: Category[] = [];

export const aiModels: AiModel[] = [];

// Small fetch helper (optional). Implement API calls in `src/api` instead.
export async function fetchModelsFromApi(): Promise<AiModel[]> {
  return [];
}
