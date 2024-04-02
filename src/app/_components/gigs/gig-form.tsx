"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/form/field-error";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { update } from "@/app/_actions/gig";
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
import { useQueryState, parseAsBoolean } from "nuqs";
import { type ClientPickerProps } from "@/types/index";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Icons } from "../icons";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Props {
  id: string;
  gig: Awaited<Partial<GigProps>>;
  client?: Awaited<ClientPickerProps> | undefined;
  clientPicker: React.ReactElement;
}

export function GigForm(props: Props) {
  const { id, clientPicker } = props;
  const { gigDate, timeStart, timeEnd, price, amountPaid } = props.gig;
  const { id: clientId, client: clientName } = props.client;

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

  const balance =
    price && amountPaid ? Number(price) - Number(amountPaid) : null;

  /* TODO: Update back to using form after creating a update funciton that maps the gigDate, start/end times.  */
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
          onSelect={(date) => void handleUpdate("gigDate", date.toISOString())}
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
            void handleUpdate(e.target.name as keyof GigProps, e.target.value);
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
            void handleUpdate(e.target.name as keyof GigProps, e.target.value)
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
