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

  // const year = date.getFullYear();
  // const month = String(date.getMonth() + 1).padStart(2, "0");
  // const day = String(date.getDate()).padStart(2, "0");

  // if (format === "friendly") {
  //   const options = {
  //     weekday: "short",
  //     month: "short",
  //     day: "numeric",
  //     year: "2-digit",
  //   };
  //   return date.toLocaleDateString("en-US", options);
  // }

  // if (format === "formal" || !format) {
  //   return `${month}/${day}/${year}`;
  // }

  if (format === "friendly") {
    return date.toLocaleDateString("en-US", {
      dateStyle: "full",
      // weekday: "short",
      // month: "short",
      // day: "numeric",
      // year: "",
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

export function formatPhone(phone: string | undefined): string {
  if (!phone) return "";
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format the cleaned number
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match && match[1] && match[2] && match[3]) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  // If no match, return the original input
  return phone;
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
  const roundedTimeDiff = Math.round(timeDiffInHours * 100) / 100;

  return roundedTimeDiff;
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

// export function duration(startTime: Date, endTime: Date): number {
//   startTime.setSeconds(0);
//   endTime.setSeconds(0);
//   startTime.setMilliseconds(0);
//   endTime.setMilliseconds(0);

//   const startMs = startTime.getTime();
//   const endMs = endTime.getTime();

//   const diffMs = endMs - startMs;

//   const diffHrs = Math.ceil(diffMs / (1000 * 60 * 60) / 10);

//   return diffHrs;
// }

// export function fromUTC(dateTimeString: string | Date): Date {
//   const utc = new Date(dateTimeString);
//   const offset = utc.getTimezoneOffset();
//   const local = new Date(utc.getTime() + offset * 60000);

//   return local;
// }

export function fromUTC(utcTimestamp: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "UTC",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  };

  const utcDate = new Date(utcTimestamp);
  return utcDate.toLocaleString("en-US", options);
}
export function toUTC(dateTimeString: string): Date {
  const local = new Date(dateTimeString);
  const offset = local.getTimezoneOffset();
  const utc = new Date(local.getTime() - offset * 60000);

  return utc;
}

export function convertTimeToISOString(selectedTime: string) {
  const [hours, minutes] = selectedTime.split(":");
  const currentDate = new Date();
  const utcOffset = currentDate.getTimezoneOffset(); // Get the UTC offset in minutes

  const localTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    Number(hours),
    Number(minutes),
    0,
    0
  );

  // Adjust the local time by subtracting the UTC offset
  localTime.setMinutes(localTime.getMinutes() - utcOffset);

  const isoTime = localTime.toISOString();

  return isoTime;
}

// Convert UTC date to local time
// export function convertUTCtoLocalTime(utcTime: Date): Date {
//   const utcDate = new Date(utcTime);
//   utcDate.setSeconds(0);
//   utcDate.setMilliseconds(0);
//   const localTime = new Date(
//     utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
//   );
//   return localTime;
// }

export function isMacOs() {
  return window.navigator.userAgent.includes("Mac");
}

// const [hours, minutes] = time.split(":");
// const date = new Date();
// date.setHours(Number(hours));
// date.setMinutes(Number(minutes));
// return date;
