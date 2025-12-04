import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getModelUrl = (id: string) => {
  try {
    const origin = typeof window !== "undefined" && window.location ? window.location.origin : "";
    return `${origin}/model/${id}`;
  } catch (e) {
    return `/model/${id}`;
  }
};
