import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getModelUrl = (slug: string) => {
  try {
    const origin = typeof window !== "undefined" && window.location ? window.location.origin : "";
    return `${origin}/model/${slug}`;
  } catch (e) {
    return `/model/${slug}`;
  }
};
