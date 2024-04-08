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
  notation: "compact" | "engineering" | "scientific" | "standard" = "standard",
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
  }).format(Number(price));
}
export function formatDate(
  input: string | number | Date,
  format?: "friendly" | "formal",
) {
  const date = new Date(input);

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
  timeEnd: Date,
): string {
  const startTime = new Date(timeStart);
  const endTime = new Date(timeEnd);
  const timeDiffInMilliseconds = Math.abs(
    startTime.getTime() - endTime.getTime(),
  );

  // Calculate hours and minutes
  const hours = Math.floor(timeDiffInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeDiffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60),
  );

  // Construct the friendly string representation
  let timeDiffString = "";
  if (hours > 0) {
    timeDiffString += hours + "h ";
  }
  if (minutes > 0) {
    timeDiffString += minutes + "m";
  }

  // Return the friendly string representation
  return timeDiffString.trim();
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
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

// export function isValidDate(date: any): date is Date {
//   if (!(date instanceof Date)) {
//     return false;
//   }

//   if (isNaN(date.getTime())) {
//     return false;
//   }

//   return true;
// }

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

export function getTimeFromDate(dateTime: Date, friendly?: boolean): string {
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  if (friendly) {
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")}${ampm}`;
  } else {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }
}

export function fromUTC(dateTimeString: string | Date): Date {
  const utcDate = new Date(dateTimeString);
  const localDate = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000,
  );

  // console.log("from utc local", localDate);
  return localDate;

  // const offset = utcDate.getTimezoneOffset();

  // utcDate.setHours(utcDate.getHours() + offset);

  // const local = utcDate.toLocaleString("en-US", {
  //   timeZone: "America/New_York",
  // });

  // return local

  // const local = new Date(utc.getTime() + offset * 60000);

  // return local;
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
    0,
  );

  // Adjust the local time by subtracting the UTC offset
  localTime.setMinutes(localTime.getMinutes() - utcOffset);

  const isoTime = localTime.toISOString();

  return isoTime;
}

export function isMacOs() {
  return window.navigator.userAgent.includes("Mac");
}

export function subHours(date: Date, hours: number): string {
  // return new Date(date.getTime() - hours * 60 * 60 * 1000);
  const newDate = new Date(date.getTime() - hours * 60 * 60 * 1000);
  return newDate.toISOString();
}

export function addHours(date: Date, hours: number): string {
  const newDate = new Date(date.getTime() + hours * 60 * 60 * 1000);
  return newDate.toISOString();
}

export function parseFormData<T extends Record<string, unknown>>(
  formData: FormData,
  schema: z.ZodSchema<T>,
): T {
  if (!(schema instanceof z.ZodObject)) {
    throw new Error("Schema must be a ZodObject");
  }
  const keys = Array.from(formData.keys()) as Array<keyof T>;
  const dataEntries: [keyof T, unknown][] = keys.map((key) => {
    try {
      const value = formData.get(key.toString());
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const parsedValue = schema.shape[key].parse(value);
      return [key, parsedValue];
    } catch (error) {
      const zodError = z.ZodError.create(
        (error as z.ZodError<T>).issues.map(
          (issue): z.ZodIssue => ({
            ...issue,
            path: [key, ...issue.path],
          }),
        ),
      );
      console.log(zodError, "zodError");
      throw zodError;
    }
  });

  return Object.fromEntries(dataEntries) as T;
}
