"use client";

import { cloneElement } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "../ui/button";

type SubmitButtonProps = {
  label?: string;
  suffixIcon?: React.ReactElement;
  // onSubmit?: () => void;
};

const SubmitButton = ({
  label = "Create",
  suffixIcon,
  // onSubmit,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className="px-4 py-2"
      type="submit"
      isLoading={pending}
    >
      {label}
      {suffixIcon && (
        <span className="ml-2">
          {cloneElement(suffixIcon, {
            className: "w-4 h-4",
          })}
        </span>
      )}
    </Button>
  );
};

export { SubmitButton };
