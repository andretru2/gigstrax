import { type FormState } from "@/components/form/to-form-state";

type FieldErrorProps = {
  formState: FormState;
  name: string;
};

const FieldError = ({ formState, name }: FieldErrorProps) => {
  const message = formState.fieldErrors[name]?.[0];

  if (!message) return null;

  return (
    <span className="text-xs text-red-500">
      {formState.fieldErrors[name]?.[0]}
    </span>
  );
};

export { FieldError };
