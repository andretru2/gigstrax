import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { type Address } from "../types";

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
export function formatDate(
  input: string | number | Date,
  format?: "friendly" | "formal"
) {
  const date = new Date(input);

  if (format === "friendly") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  }

  if (format === "formal" || !format) {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  }
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

export function formatAddress({
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
  name,
}: Address) {
  const lines = [addressLine1];
  if (addressLine2) {
    lines.push(addressLine2);
  }
  const cityState = [city, state].filter(Boolean).join(", ");
  const address = [name, ...lines, cityState, zip].filter(Boolean).join("\n");
  return address;
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}
