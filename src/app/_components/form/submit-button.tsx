"use client";

import { cloneElement } from "react";
import { useFormStatus } from "react-dom";

import { Icons } from "../icons";
import { Button } from "../ui/button";

type SubmitButtonProps = {
  label?: string;
  suffixIcon?: React.ReactElement;
};

const SubmitButton = ({ label = "Create", suffixIcon }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
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
