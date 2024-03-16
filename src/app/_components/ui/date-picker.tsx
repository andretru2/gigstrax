"use client";

import { useImperativeHandle, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Icons } from "../icons";

type DatePickerProps = {
  id: string;
  name: string;
  defaultValue?: string;
  imperativeHandleRef: React.RefObject<{
    reset: () => void;
  }>;
};

const DatePicker = ({
  id,
  name,
  defaultValue,
  imperativeHandleRef,
}: DatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined,
  );

  useImperativeHandle(
    imperativeHandleRef,
    () => ({
      reset() {
        setDate(undefined);
      },
    }),
    [],
  );

  const formattedStringDate = date ? formatDate(date, "friendly") : "";

  return (
    <Popover>
      <PopoverTrigger id={id} className="w-full" asChild>
        <Button
          variant="outline"
          className="bg-white  text-left font-normal hover:bg-none"
        >
          <Icons.calendar className=" mr-2 size-4" />

          {formattedStringDate}
          <input type="hidden" name={name} value={formattedStringDate} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };

{
  /* <Button
  variant={"outline"}
  className={cn(
    "bg-white pl-3 text-left font-normal hover:bg-none",
    !field.value && "text-muted-foreground",
  )}
>
  {field.value ? formatDate(field.value, "friendly") : <span>Pick a date</span>}
  <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
</Button>; */
}
