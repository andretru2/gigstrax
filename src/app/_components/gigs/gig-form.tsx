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
// import { DatePicker } from "../ui/date-picker";
import type { Gig as GigProps } from "@prisma/client";

interface Props {
  gig?: Awaited<GigProps>;
}

export function GigForm({ gig }: Props) {
  const [formState, action] = useFormState(
    update.bind(null, gig?.id),
    EMPTY_FORM_STATE,
  );

  const { ref } = useFormFeedback(formState, {
    onSuccess: ({ formState, reset }) => {
      if (formState.message) {
        toast.success(formState.message);
      }

      reset();
    },
    onError: ({ formState }) => {
      if (formState.message) {
        toast.error(formState.message);
      }
    },
  });

  const { gigDate } = gig;

  console.log(gigDate, gig[0], "gigDate");

  return (
    <form
      action={action}
      ref={ref}
      className="grid w-full grid-cols-12  gap-4 "
    >
      <div className="col-span-12">
        <Label htmlFor="gigDate">Gig Date</Label>
        <Input id="gigDate" name="gigDate" defaultValue={gigDate} />
        <FieldError formState={formState} name="gigDate" />
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
