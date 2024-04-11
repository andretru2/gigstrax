"use client";

import type { Gig } from "@prisma/client";
import { startTransition } from "react";
import { saveGig } from "@/app/_actions/gig";
import { toast } from "sonner";

export interface SaveGigProps {
  id: string;
  key: keyof Gig;
  value: unknown;
}

export async function handleSaveGig(props: SaveGigProps) {
  const { id, key, value } = props;
  // if (!value) return { result: "Error", resultDescription: "Missing value." };

  let result;
  const formData = new FormData();
  formData.append(key, value);

  const resultSaveGig = await saveGig(id, formData);
  if (!resultSaveGig) {
    return { result: "Error", resultDescription: "Unknown error." };
  }

  resultSaveGig.status === "ERROR"
    ? startTransition(() => {
        const error = resultSaveGig?.issues[0];
        toast.error(error);
        result = {
          result: "Error",
          resultDescription: error,
          fieldError: { [key]: error },
        };
      })
    : startTransition(() => {
        toast.success(resultSaveGig?.message);
        result = {
          result: "Success",
          resultDescription: resultSaveGig?.message,
        };
      });

  return result;
}
