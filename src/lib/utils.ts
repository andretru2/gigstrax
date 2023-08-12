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
      // dateStyle: "full",
      weekday: "short",
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
  const nameLines = [name, ...lines].filter(Boolean).join(", ");
  const cityState = [city, state].filter(Boolean).join(", ");
  const address = [nameLines, cityState, zip].filter(Boolean).join("\n");
  return address;
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

export function isValidDate(date: any): date is Date {
  if (!(date instanceof Date)) {
    return false;
  }

  if (isNaN(date.getTime())) {
    return false;
  }

  return true;
}

export function isValidTime(time: string) {
  // Regex to match HH:MM format
  const regex = /^([01]\d|2[0-3]):?([0-5]\d)$/;

  if (!regex.test(time)) {
    return false;
  }

  const [hours, minutes] = time.split(":");

  if (
    hours &&
    parseInt(hours) >= 0 &&
    parseInt(hours) <= 23 &&
    minutes &&
    parseInt(minutes) >= 0 &&
    parseInt(minutes) <= 59
  ) {
    return true;
  }

  return false;
}

export function isValidPrice(price: string): boolean {
  // Optional decimal part
  const regex = /^\d+(?:\.\d+)?$/;

  if (!regex.test(price)) {
    return false;
  }

  const numPrice = Number(price);

  if (Number.isNaN(numPrice)) {
    return false;
  }

  if (numPrice < 0) {
    return false;
  }

  return true;
}

export function formatTime(time: Date) {
  return time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function duration(startTime: Date, endTime: Date): number {
  startTime.setSeconds(0);
  endTime.setSeconds(0);
  startTime.setMilliseconds(0);
  endTime.setMilliseconds(0);

  const startMs = startTime.getTime();
  const endMs = endTime.getTime();

  const diffMs = endMs - startMs;

  const diffHrs = diffMs / (1000 * 60 * 60);

  return diffHrs;
}

export function formatTimeToUTC(timeString: string): string {
  const localTime = new Date(timeString);
  const utcTime = new Date(
    Date.UTC(
      localTime.getFullYear(),
      localTime.getMonth(),
      localTime.getDate(),
      localTime.getHours(),
      localTime.getMinutes()
    )
  );
  return utcTime.toISOString().substr(11, 5);
}

// Get UTC date based on selected time
export function getUTCDate(selectedTime: string): Date {
  const currentDate = new Date();
  const [hours, minutes] = selectedTime.split(":");
  currentDate.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10));
  return currentDate;
}

// Convert UTC date to local time
export function convertUTCtoLocalTime(utcDate: Date): Date {
  const localTime = new Date(utcDate);
  return localTime;
}

export function isMacOs() {
  return window.navigator.userAgent.includes("Mac");
}

// const [hours, minutes] = time.split(":");
// const date = new Date();
// date.setHours(Number(hours));
// date.setMinutes(Number(minutes));
// return date;
