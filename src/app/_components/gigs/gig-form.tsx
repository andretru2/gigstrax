"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/form/field-error";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { update } from "@/app/_actions/gig";
import { type Gig as GigProps, Prisma } from "@prisma/client";
import { DatePicker } from "../ui/date-picker";
import { type FocusEvent, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function GigForm(props: Awaited<GigProps>) {
  const { id, gigDate, price } = props;

  const updateGigWithId = update.bind(null, id);

  const [formState, action] = useFormState(updateGigWithId, EMPTY_FORM_STATE);

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

  return (
    <form
      action={action}
      ref={ref}
      className="grid w-full grid-cols-12  gap-4 "
    >
      <Card className="col-span-12 p-4 ">
        <CardHeader className="px-0">
          <CardTitle>Gig Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-8 items-end gap-2 px-0">
          <div className="col-span-2">
            <Label htmlFor="gigDate">Gig Date</Label>
            <Input id="gigDate" name="gigDate" defaultValue={gigDate} />
            <FieldError formState={formState} name="gigDate" />
          </div>

          <div className="col-span-2">
            <Label htmlFor="gigDate">Gig Date</Label>
            <DatePicker
              id="gigDate"
              name="gigDate"
              defaultValue={gigDate}
              imperativeHandleRef={datePickerImperativeHandleRef}
            />
            <FieldError formState={formState} name="gigDate" />
          </div>

          <div className="col-span-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              inputMode="numeric"
              name="price"
              defaultValue={Number(price)}
              className="bg-white text-right"
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                const handleUpdate = async () => {
                  if (!e.target.value) return;
                  const formData = new FormData();
                  formData.append("price", e.target.value);

                  const res = await update(props.id, formState, formData);
                  console.log(res, "res");
                  res?.status === "ERROR"
                    ? toast.error(res.message)
                    : toast.success(res?.message);
                };

                handleUpdate();
              }}
            />
            <FieldError formState={formState} name="price" />
          </div>
        </CardContent>
      </Card>

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

function Details(props: GigProps) {
  return (
    <Card className="col-span-2 p-4 ">
      <CardHeader className="px-0">
        <CardTitle>Gig Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-8 items-end gap-2 px-0">
        <div className="col-span-2">
          <Label htmlFor="gigDate">Gig Date</Label>
          <Input id="gigDate" name="gigDate" defaultValue={props.gigDate} />
          <FieldError formState={formState} name="gigDate" />
        </div>

        <div className="col-span-2">
          <Label htmlFor="gigDate">Gig Date</Label>
          <DatePicker
            id="gigDate"
            name="gigDate"
            defaultValue={props.gigDate}
            imperativeHandleRef={datePickerImperativeHandleRef}
          />
          <FieldError formState={formState} name="gigDate" />
        </div>
      </CardContent>
    </Card>
  );
}
