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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRef } from "react";

const TABS = [
  {
    id: "tab-1",
    value: "1-10",
  },
  // {
  //   id: "tab-2",
  //   value: "11-20",
  // },
  // {
  //   id: "tab-3",
  //   value: "21-30",
  // },
];
const SLOTS_PER_TAB = 10;

interface Props {
  copiedFromId: string;
}

export function MultiEventCreateForm(props: Props) {
  // const [fieldError, setFieldError] = useQueryStates(fieldErrorParser);

  const submitMultiEventFormWithId = submitMultiEventForm.bind(
    null,
    props.copiedFromId,
  );

  console.log(props.copiedFromId);
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

  const generateFieldNames = (prefix: string) => {
    return Array.from({ length: SLOTS_PER_TAB }, (_, i) => `${prefix}${i}`);
  };

  const gigDateFieldNames = generateFieldNames("gigDate");
  const timeStartFieldNames = generateFieldNames("timeStart");
  const timeEndFieldNames = generateFieldNames("timeEnd");

  return (
    <form action={formAction} ref={ref} className="">
      <Card className="h-full w-full p-4">
        <CardHeader className="px-0">
          {/* <CardTitle>Create Multi-Event</CardTitle> */}
        </CardHeader>
        <CardContent className=" flex flex-col gap-2">
          {Array.from({ length: SLOTS_PER_TAB }).map((_, i) => (
            <div key={i} className="form grid grid-cols-5 gap-2">
              <Label className="col-span-3">
                <DatePicker
                  id={gigDateFieldNames[i]}
                  name={gigDateFieldNames[i]}
                  imperativeHandleRef={datePickerImperativeHandleRef}
                />
                <span>Gig Date</span>
              </Label>

              <Label className="col-span-1">
                <Input
                  type="time"
                  id={timeStartFieldNames[i]}
                  name={timeStartFieldNames[i]}
                />
                <span>Start</span>
              </Label>

              <Label className="col-span-1">
                <Input
                  type="time"
                  id={timeEndFieldNames[i]}
                  name={timeEndFieldNames[i]}
                />
                <span>End</span>
              </Label>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <SubmitButton label="Create Gigs" />
        </CardFooter>
      </Card>
    </form>
  );
}
