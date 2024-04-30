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

  onSelect?: (date: Date) => void;
};

const DatePicker = ({
  id,
  name,
  defaultValue,
  imperativeHandleRef,

  onSelect,
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
      <PopoverTrigger
        id={id}
        className="w-full justify-start text-left"
        asChild
      >
        <Button
          variant="outline"
          className=" bg-white   font-normal hover:bg-none"
        >
          <Icons.calendar className=" mr-2 size-3" />

          {formattedStringDate}
          <input type="hidden" name={name} value={formattedStringDate} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            setDate(date);
            onSelect && date && onSelect(date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
