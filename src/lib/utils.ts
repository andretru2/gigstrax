import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  currency: "USD" | "EUR" | "GBP" | "BDT" = "USD",
  notation: "compact" | "engineering" | "scientific" | "standard" = "standard"
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
  }).format(Number(price));
}
export function formatDate(input: string | number | Date): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    // month: "2-digit",
    // month: "short",
    // day: "2-digit",
    day: "numeric",
    // year: "numeric",
    year: "2-digit",
  });
}

export function catchError(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return toast(errors.join("\n"));
  } else if (err instanceof Error) {
    return toast(err.message);
  } else {
    return toast("Something went wrong, please try again later.");
  }
}

export function calculateTimeDifference(
  timeStart: Date,
  timeEnd: Date
): number {
  const startTime = new Date(timeStart);
  const endTime = new Date(timeEnd);
  const timeDiffInMilliseconds = Math.abs(
    startTime.getTime() - endTime.getTime()
  );
  const timeDiffInHours = timeDiffInMilliseconds / (1000 * 60 * 60);
  return timeDiffInHours;
}
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}
