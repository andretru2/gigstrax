"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "../ui/date-picker";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { submitMultiEventForm } from "@/app/_actions/gig";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { useQueryStates } from "nuqs";
// import { fieldErrorParser } from "../search-params";
import { useRef, Fragment } from "react";
import { Separator } from "../ui/separator";
import { SubmitButton } from "../form/submit-button";
import { combineDateTimeToISOString } from "@/lib/utils";

interface Props {
  copiedFromId: string;
}

export function MultiEventCreateForm(props: Props) {
  // const [loading, setLoading] = useState(false);
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

  function processFormData(formData: FormData) {
    const gigDates = formData.getAll("gigDate");
    const timeStarts = formData.getAll("timeStart");
    const timeEnds = formData.getAll("timeEnd");

    return gigDates
      .map((gigDate, index) => {
        const timeStart = timeStarts[index];
        const timeEnd = timeEnds[index];

        if (timeStart && timeEnd && gigDate) {
          const gigDateObj = new Date(gigDate);
          const gigDateISO = gigDateObj.toISOString();
          const timeStartISO = combineDateTimeToISOString(
            gigDateObj,
            timeStart,
          );
          const timeEndISO = combineDateTimeToISOString(gigDateObj, timeEnd);

          return { gigDateISO, timeStartISO, timeEndISO };
        }
        return null;
      })
      .filter(Boolean);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = ref.current && new FormData(ref.current);

    if (!formData) return;
    const processedData = processFormData(formData);
    processedData && formAction(processedData);
    ref?.current?.reset();
    datePickerImperativeHandleRef.current?.reset();
  }

  return (
    <Card className="h-full w-full p-4">
      <CardHeader className="px-0">
        <CardTitle>Create Gig(s)</CardTitle>
        {/* <CardDescription>
          The gig will be created with the same data as this gig, except the new
          date and time specified
        </CardDescription> */}
      </CardHeader>
      <Separator />
      <CardContent className="px-0 ">
        <form
          onSubmit={handleSubmit}
          // action={formAction}
          ref={ref}
          className="form grid max-w-4xl grid-cols-11 gap-2"
        >
          {Array.from({ length: 10 }, (_, index) => (
            <Fragment key={index}>
              <Input
                className="col-span-1 bg-transparent text-center"
                disabled
                value={index + 1}
              />
              <Label className="col-span-4">
                <DatePicker
                  id="gigDate"
                  name="gigDate"
                  imperativeHandleRef={datePickerImperativeHandleRef}
                />
                <span>Gig Date</span>
              </Label>
              <Label className="col-span-3">
                <Input type="time" id="timeStart" name="timeStart" />
                <span>Start</span>
              </Label>
              <Label className="col-span-3">
                <Input type="time" id="timeEnd" name="timeEnd" />
                <span>End</span>
              </Label>
            </Fragment>
          ))}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
