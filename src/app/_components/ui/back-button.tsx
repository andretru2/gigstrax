"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Icons } from "../icons";

const defaultFallback = "/"; // Default fallback path if no history is present

export function BackButton({ fallback = defaultFallback }) {
  const router = useRouter();

  function handleBack() {
    window.history.length > 1
      ? router.back()
      : router.push(fallback || defaultFallback);
  }

  return (
    <Button
      className="flex items-center gap-1 self-start text-sm text-current"
      onClick={handleBack}
    >
      <Icons.arrowLeft aria-hidden="true" className="size-4 opacity-70" />
      <span className="pr-1">Go back</span>
    </Button>
  );
}
