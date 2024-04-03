"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/form/field-error";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { submitGig } from "@/app/_actions/gig";
import { type Gig as GigProps } from "@prisma/client";
import { DatePicker } from "../ui/date-picker";
import { type FocusEvent, useRef, startTransition, useState } from "react";
import {
  calculateTimeDifference,
  cn,
  formatDate,
  formatPrice,
  getTimeFromDate,
} from "@/lib/utils";
import { useQueryStates, parseAsBoolean, useQueryState } from "nuqs";
import { type ClientPickerProps } from "@/types/index";
import { handleSaveGig, type SaveGigProps } from "@/lib/gig/handle-save-gig";

import { Button } from "../ui/button";
import { Icons } from "../icons";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type ParsedSearchParams, fieldErrorParser } from "../search-params";

interface Props {
  id: string;
  gig: Awaited<Partial<GigProps>>;
  client?: Awaited<ClientPickerProps> | undefined;
  clientPicker: React.ReactElement;
  // searchParams?: ParsedSearchParams;
}

export function GigForm(props: Props) {
  const { id } = props;
  const { gigDate, timeStart, timeEnd, price, amountPaid } = props.gig;
  const { id: clientId, client: clientName } = props.client;

  // const [fieldError, setFieldError] = useQueryStates(
  //   { key: props.searchParams?.key, error: props.searchParams?.error },
  //   fieldErrorParser,
  // );
  const [fieldError, setFieldError] = useQueryStates(fieldErrorParser);

  console.log("fieldError", fieldError);

  const submitGigWithId = submitGig.bind(null, id);

  const [formState, formAction] = useFormState(
    submitGigWithId,
    EMPTY_FORM_STATE,
  );

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
      const saveGigdTime = new Date(
        gigDateObj.getFullYear(),
        gigDateObj.getMonth(),
        gigDateObj.getDate(),
        Number(hours),
        Number(minutes),
      );
      void handleSaveGigWrapper({
        id: id,
        key: e.target.name as keyof GigProps,
        value: saveGigdTime.toISOString(),
      });
    }
  }

  async function handleSaveGigWrapper(props: SaveGigProps) {
    const resultSave = await handleSaveGig(props);
    if (resultSave.result === "Error") {
      void setFieldError({
        key: props.key,
        error: resultSave.resultDescription,
      });
    }
    void setFieldError({ key: null, error: null });
  }

  const durationHours =
    timeStart && timeEnd ? calculateTimeDifference(timeStart, timeEnd) : null;

  const balance =
    price && amountPaid ? Number(price) - Number(amountPaid) : null;

  return (
    <form
      action={formAction}
      ref={ref}
      className="form grid w-full  grid-cols-12 items-center justify-center gap-x-4 gap-y-6"
    >
      <Label className="col-span-2">
        <DatePicker
          id="gigDate"
          name="gigDate"
          defaultValue={gigDate ? formatDate(gigDate, "formal") : ""}
          onSelect={(date) => {
            void handleSaveGigWrapper({
              id: id,
              key: "gigDate",
              value: date.toISOString(),
            });
          }}
          imperativeHandleRef={datePickerImperativeHandleRef}
        />
        <span>Gig Date</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "gigDate" ? fieldError.error : null}
          name="gigDate"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          type="time"
          disabled={gigDate == null}
          name="timeStart"
          defaultValue={timeStart ? getTimeFromDate(timeStart) : undefined}
          className="text-right"
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleTimeInputBlur(e)
          }
        />
        <span>Start</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "timeStart" ? fieldError.error : null}
          name="timeStart"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          type="time"
          disabled={gigDate == null}
          name="timeEnd"
          defaultValue={timeEnd ? getTimeFromDate(timeEnd) : undefined}
          className="text-right"
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleTimeInputBlur(e)
          }
        />
        <span>End</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "timeEnd" ? fieldError.error : null}
          name="timeEnd"
        />
      </Label>

      <Label className="col-span-1 w-20">
        <Input
          disabled={true}
          name="duration"
          defaultValue={durationHours ? durationHours : undefined}
        />
        <span>Duration</span>
      </Label>

      <Label className="col-span-1">
        <Input
          type="number"
          inputMode="numeric"
          name="price"
          defaultValue={Number(price)}
          onBlur={(e: FocusEvent<HTMLInputElement>) => {
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            });
          }}
        />
        <span>Price</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "price" ? fieldError.error : null}
          name="price"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          type="number"
          inputMode="numeric"
          name="amountPaid"
          defaultValue={Number(amountPaid)}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveGigWrapper({
              id: id,
              key: e.target.name as keyof GigProps,
              value: e.target.value,
            })
          }
        />
        <span>Paid</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "amountPaid" ? fieldError.error : null}
          name="amountPaid"
        />
      </Label>

      <Label className="col-span-1">
        <Input
          disabled={true}
          name="balance"
          defaultValue={balance ? formatPrice(balance) : ""}
          className={cn(
            "disabled:bg-none",
            balance && balance > 0 && "font-bold text-destructive",
          )}
        />
        <span>Balance</span>
      </Label>

      <Label className="col-span-3">
        <Input name="clientId" defaultValue={clientId ? clientName : ""} />
        <span>Client</span>
      </Label>

      <Label className="col-span-3 row-start-2">
        {/* {props.clientPicker} */}
        <ClientPicker {...props} />
        <span>Client</span>
      </Label>

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

function ClientPicker(props: Props) {
  const [open, setOpen] = useQueryState(
    "modalOpen",
    parseAsBoolean.withDefault(false),
  );

  function handleDrawerOpen() {
    void setOpen(!open);
  }

  return (
    <Sheet open={open} onOpenChange={handleDrawerOpen}>
      <SheetTrigger className="w-full justify-start text-left" asChild>
        <Button variant="outline">
          <Icons.user className=" mr-2 size-3" />
          {props.client?.client}
          <Input type="hidden" name="clientId" value={props.client?.client} />
        </Button>
      </SheetTrigger>
      <SheetContent className="">{props.clientPicker}</SheetContent>
    </Sheet>
  );
}
