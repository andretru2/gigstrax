import { ZodError } from "zod";

export type FormState = {
  status: "IDLE" | "SUCCESS" | "ERROR";
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
  issues?: string[];
  timestamp: number;
};

export const EMPTY_FORM_STATE: FormState = {
  status: "IDLE" as const,
  message: "",
  fieldErrors: {},
  issues: [],
  timestamp: Date.now(),
};

export const fromErrorToFormState = (error: unknown) => {
  const isZodError = error instanceof ZodError;
  const message = isZodError
    ? error.message
    : error instanceof Error
      ? error.message
      : "An unknown error occurred";

  const fieldErrors = isZodError ? error.flatten().fieldErrors : {};

  const issues = isZodError ? error.issues.map((issue) => issue.message) : [];

  return {
    status: "ERROR" as const,
    message,
    fieldErrors,
    issues,
    timestamp: Date.now(),
  };
};

export const toFormState = (
  status: FormState["status"],
  message: string,
): FormState => {
  return {
    status,
    message,
    fieldErrors: {},
    issues: [],
    timestamp: Date.now(),
  };
};
