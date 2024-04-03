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
import { type ParsedSearchParams, modalOpenParser } from "../search-params";
import { useQueryState } from "nuqs";
import { handleSaveGig } from "@/lib/gig/handle-save-gig";
import { createSource } from "@/app/_actions/source";
import { type SantaType } from "@/types/index";

interface Props {
  searchParams?: ParsedSearchParams;
  gigId?: string | undefined;
  role: SantaType;
}

export function SourcePickerCreate(props: Props) {
  const [source, setSource] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useQueryState(
    props.role === "RBS" ? "modalOpenSanta" : "modalOpenMrsSanta",
    modalOpenParser,
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSource(event.target.value);
  };

  const handleCreate = () => {
    startTransition(async () => {
      const data = {
        nameFirst: source,
        nameRole: source,
        role: source,
        status: "Active",
      };

      const { sourceId } = await createSource(data);
      console.log("sourceId", sourceId);
      props.gigId &&
        void handleSaveGig({
          id: props.gigId,
          key: props.role === "RBS" ? "santaId" : "mrsSantaId",
          value: sourceId,
        });
      void setOpen(!open);
    });
  };

  return (
    <Card className="h-full w-full p-4">
      <CardHeader>
        <CardTitle className="pl-2">Create new</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-4">
        <Label className="font-medium">
          <Input
            name={"nameFirst"}
            value={source}
            onChange={handleInputChange}
          />
          <span>First</span>
        </Label>
        <Label className="font-medium">
          <Input
            name={"nameLast"}
            value={source}
            onChange={handleInputChange}
          />
          <span>Last</span>
        </Label>
        <Label className="font-medium">
          <Input
            name={props.role === "RBS" ? "santaId" : "mrsSantaId"}
            value={source}
            onChange={handleInputChange}
          />
          <span>First</span>
        </Label>

        <Button
          type="button"
          className="self-center"
          isLoading={isPending}
          onClick={handleCreate}
          disabled={!source || isPending}
        >
          Create
        </Button>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
