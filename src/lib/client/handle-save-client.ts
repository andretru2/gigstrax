"use client";

import type { Client } from "@prisma/client";
import { startTransition } from "react";
import { saveClient } from "@/app/_actions/client";
import { toast } from "sonner";

export interface SaveClientProps {
  id: string;
  key: keyof Client;
  value: unknown;
}

export async function handleSaveClient(props: SaveClientProps) {
  const { id, key, value } = props;

  let result;
  const formData = new FormData();
  formData.append(key, value);

  const resultSaveClient = await saveClient(id, formData);
  if (!resultSaveClient) {
    return { result: "Error", resultDescription: "Unknown error." };
  }

  resultSaveClient.status === "ERROR"
    ? startTransition(() => {
        const error = resultSaveClient?.issues[0];
        toast.error(error);
        result = {
          result: "Error",
          resultDescription: error,
          fieldError: { [key]: error },
        };
      })
    : startTransition(() => {
        toast.success(resultSaveClient?.message);
        result = {
          result: "Success",
          resultDescription: resultSaveClient?.message,
        };
      });

  return result;
}
