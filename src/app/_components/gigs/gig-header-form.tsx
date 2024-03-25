"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/form/field-error";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { update } from "@/app/_actions/gig";
import type { Gig as GigProps } from "@prisma/client";
import { DatePicker } from "../ui/date-picker";
import { type FocusEvent, useRef, startTransition, useState } from "react";
import {
  calculateTimeDifference,
  formatDate,
  getTimeFromDate,
} from "@/lib/utils";

export function GigHeaderForm(
  props: Awaited<{ id: string } & Partial<GigProps>>,
) {
  const { id, gigDate, timeStart, timeEnd, price, amountPaid } = props;

  // console.log(timeStart, timeEnd, calculateTimeDifference(timeStart, timeEnd));

  const updateGigWithId = update.bind(null, id);

  const [formState, formAction] = useFormState(
    updateGigWithId,
    EMPTY_FORM_STATE,
  );
  const [fieldError, setFieldError] = useState<
    Record<string, string | null | undefined>
  >({});

  const datePickerImperativeHandleRef = useRef<{
    reset: () => void;
  }>(null);
  const { ref } = useFormFeedback(formState, {
    onSuccess: ({ formState, reset }) => {
      if (formState.message) {
        toast.success(formState.message);
      }
      reset();
      datePickerImperativeHandleRef.current?.reset();
    },
    onError: ({ formState }) => {
      if (formState.message) {
        toast.error(formState.message);
      }
    },
  });

  function handleTimeInputBlur(e: FocusEvent<HTMLInputElement>) {
    const selectedTime = e.target.value;

    if (selectedTime && gigDate) {
      const [hours, minutes] = selectedTime.split(":");
      const gigDateObj = new Date(gigDate);
      const updatedTime = new Date(
        gigDateObj.getFullYear(),
        gigDateObj.getMonth(),
        gigDateObj.getDate(),
        Number(hours),
        Number(minutes),
      );
      void handleUpdate(
        e.target.name as keyof GigProps,
        updatedTime.toISOString(),
      );
    }
  }

  const handleUpdate = async (
    key: keyof GigProps,
    value: unknown,
  ): Promise<void> => {
    if (!key || !value) return;
    const formData = new FormData();
    formData.append(key, value);
    const res = await update(id, formState, formData);
    if (!res) {
      return void toast.error("An unknown error occurred");
    }

    res?.status === "ERROR"
      ? startTransition(() => {
          const error = res?.issues[0];
          setFieldError({ key, error });
          toast.error(error);
        })
      : startTransition(() => {
          toast.success(res?.message);
          setFieldError({});
        });
  };

  const durationHours =
    timeStart && timeEnd ? calculateTimeDifference(timeStart, timeEnd) : null;

  return (
    <form
      action={formAction}
      ref={ref}
      className="grid w-full grid-cols-12  gap-4 [&>label]:ml-12"
    >
      <div className="col-span-2 space-y-1">
        <Label htmlFor="gigDate">Gig Date</Label>
        <DatePicker
          id="gigDate"
          name="gigDate"
          defaultValue={gigDate ? formatDate(gigDate, "formal") : ""}
          onSelect={(date) => void handleUpdate("gigDate", date.toISOString())}
          imperativeHandleRef={datePickerImperativeHandleRef}
        />
        <FieldError
          formState={formState}
          error={fieldError.key === "gigDate" ? fieldError.error : null}
          name="gigDate"
        />
      </div>
      <div className="col-span-1 space-y-1">
        <Label htmlFor="timeStart">Start</Label>
        <Input
          type="time"
          disabled={gigDate == null}
          name="timeStart"
          defaultValue={timeStart ? getTimeFromDate(timeStart) : undefined}
          className="bg-white text-right"
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleTimeInputBlur(e)
          }
        />
        <FieldError
          formState={formState}
          error={fieldError.key === "timeStart" ? fieldError.error : null}
          name="timeStart"
        />
      </div>
      <div className="col-span-1 space-y-1">
        <Label htmlFor="timeEnd">End</Label>
        <Input
          type="time"
          disabled={gigDate == null}
          name="timeEnd"
          defaultValue={timeEnd ? getTimeFromDate(timeEnd) : undefined}
          className="bg-white text-right"
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleTimeInputBlur(e)
          }
        />
        <FieldError
          formState={formState}
          error={fieldError.key === "timeEnd" ? fieldError.error : null}
          name="timeEnd"
        />
      </div>
      <div className="col-span-1 w-20 space-y-1">
        <Label htmlFor="duration">Duration</Label>
        <Input
          disabled={true}
          name="duration"
          defaultValue={durationHours ? durationHours : undefined}
          className=""
        />
      </div>

      <div className="col-span-1 space-y-1">
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          inputMode="numeric"
          name="price"
          defaultValue={Number(price)}
          className="bg-white "
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleUpdate(e.target.name as keyof GigProps, e.target.value)
          }
        />
        <FieldError
          formState={formState}
          error={fieldError.key === "price" ? fieldError.error : null}
          name="price"
        />
      </div>

      <noscript>
        {formState.status === "ERROR" && (
          <div style={{ color: "red" }}>{formState.message}</div>
        )}

        {formState.status === "SUCCESS" && (
          <div style={{ color: "green" }}>{formState.message}</div>
        )}
      </noscript>
    </form>
  );
}
