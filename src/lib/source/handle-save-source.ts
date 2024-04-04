"use client";

import type { Source } from "@prisma/client";
import { startTransition } from "react";
import { saveSource } from "@/app/_actions/source";
import { toast } from "sonner";

export interface SaveSourceProps {
  id: string;
  key: keyof Source;
  value: unknown;
}

export async function handleSaveSource(props: SaveSourceProps) {
  const { id, key, value } = props;

  let result;
  const formData = new FormData();
  formData.append(key, value);

  const resultSaveSource = await saveSource(id, formData);
  if (!resultSaveSource) {
    return { result: "Error", resultDescription: "Unknown error." };
  }

  resultSaveSource.status === "ERROR"
    ? startTransition(() => {
        const error = resultSaveSource?.issues[0];
        toast.error(error);
        result = {
          result: "Error",
          resultDescription: error,
          fieldError: { [key]: error },
        };
      })
    : startTransition(() => {
        toast.success(resultSaveSource?.message);
        result = {
          result: "Success",
          resultDescription: resultSaveSource?.message,
        };
      });

  return result;
}
