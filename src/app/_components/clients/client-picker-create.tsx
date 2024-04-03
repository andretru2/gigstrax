"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createClient } from "@/app/_actions/client";
import { type ParsedSearchParams, modalOpenParser } from "../search-params";
import { useQueryState } from "nuqs";
import { handleSaveGig } from "@/lib/gig/handle-save-gig";

interface Props {
  searchParams?: ParsedSearchParams;
  gigId?: string | undefined;
}

export function ClientPickerCreate(props: Props) {
  const [client, setClient] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useQueryState("modalOpenClient", modalOpenParser);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClient(event.target.value);
  };

  const handleCreate = () => {
    startTransition(async () => {
      const { clientId } = await createClient({ client });
      props.gigId &&
        void handleSaveGig({
          id: props.gigId,
          key: "clientId",
          value: clientId,
        });
      void setOpen(!open);
    });
  };

  return (
    <Card className="h-full w-full p-4">
      <CardHeader>
        <CardTitle className="pl-2">Create new Client</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-4">
        <Label className="font-medium">
          <Input name="clientId" value={client} onChange={handleInputChange} />
        </Label>
        <Button
          type="button"
          className="self-center"
          isLoading={isPending}
          onClick={handleCreate}
          disabled={!client || isPending}
        >
          Create Client
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
