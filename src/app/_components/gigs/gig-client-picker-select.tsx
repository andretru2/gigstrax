"use client";

import { type ClientPickerProps } from "@/types/index";
import { Button } from "../ui/button";
import { gigSelectClientPicker } from "@/app/_actions/gig";
import { useQueryState } from "nuqs";
import { toTitleCase } from "@/lib/utils";
import { type ParsedSearchParams } from "../clients/search-params";
import { modalOpenParser } from "../clients/search-params";
import { cn } from "@/lib/utils";

interface Props {
  gigId: string;
  client: ClientPickerProps;
  searchParams?: ParsedSearchParams;
  className?: string;
}

export function GigClientPickerSelect(props: Props) {
  const [open, setOpen] = useQueryState("modalOpen", modalOpenParser);

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "  w-full justify-start truncate  p-2 text-left hover:bg-primary hover:text-black ",
        props.className,
      )}
      onClick={() => {
        void setOpen(!open);
        void gigSelectClientPicker(props.gigId, props.client.id);
      }}
    >
      {toTitleCase(props.client.client)}
    </Button>
  );
}
