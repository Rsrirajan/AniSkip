import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createPageUrl(pageName: string): string {
  const pageMap: Record<string, string> = {
    Dashboard: "/",
    Library: "/library",
    Search: "/search",
    Settings: "/settings",
    Subscription: "/subscription",
    AnimeDetails: "/anime"
  };
  
  return pageMap[pageName] || "/";
} 