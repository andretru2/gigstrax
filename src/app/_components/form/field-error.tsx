import { type FormState } from "@/components/form/to-form-state";

type FieldErrorProps = {
  formState?: FormState;
  name: string;
  error?: string | null;
};

const FieldError = ({ formState, name, error }: FieldErrorProps) => {
  const message = error ? error : formState?.fieldErrors[name]?.[0];

  if (!message) return null;

  return <div className="text-xs text-red-500">{message}</div>;
};

export { FieldError };
