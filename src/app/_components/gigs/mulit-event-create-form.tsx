"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "../ui/date-picker";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { submitMultiEventForm } from "@/app/_actions/gig";
import { SubmitButton } from "../form/submit-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
// import { useQueryStates } from "nuqs";
// import { fieldErrorParser } from "../search-params";
import { useRef } from "react";
import { Separator } from "../ui/separator";

interface Props {
  copiedFromId: string;
}

export function MultiEventCreateForm(props: Props) {
  const submitMultiEventFormWithId = submitMultiEventForm.bind(
    null,
    props.copiedFromId,
  );

  const [formState, formAction] = useFormState(
    submitMultiEventFormWithId,
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

  const datePickerImperativeHandleRef = useRef<{
    reset: () => void;
  }>(null);

  return (
    <Card className="h-full w-full p-4">
      <CardHeader className="px-0">
        <CardTitle>Copy Gig</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="px-0">
        <form
          action={formAction}
          ref={ref}
          className="form grid max-w-96 grid-cols-5 gap-2"
        >
          <Label className="col-span-3">
            <DatePicker
              id="gigDate"
              name="gigDate"
              imperativeHandleRef={datePickerImperativeHandleRef}
            />
            <span>Gig Date</span>
          </Label>
          <Label className="col-span-1">
            <Input type="time" id="timeStart" name="timeStart" />
            <span>Start</span>
          </Label>
          <Label className="col-span-1">
            <Input type="time" id="timeEnd" name="timeEnd" />
            <span>End</span>
          </Label>
        </form>
      </CardContent>

      <CardFooter className="flex flex-row gap-3">
        <SubmitButton label="Create & Add More" />
        <SubmitButton label="Create & Finish" />
      </CardFooter>
    </Card>
  );
}
