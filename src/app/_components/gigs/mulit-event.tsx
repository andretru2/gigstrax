import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "../ui/date-picker";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { submitMultiEventForm } from "@/app/_actions/gig";
import { SubmitButton } from "../form/submit-button";
import { gigSchema } from "@/lib/validations/gig";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useQueryStates } from "nuqs";
import { fieldErrorParser } from "../search-params";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn, formatDate } from "@/lib/utils";
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
  idCopyFrom: string;
}

export function CreateMultiEventForm(props: Props) {
  const [fieldError, setFieldError] = useQueryStates(fieldErrorParser);

  const submitMultiEventFormWithId = submitMultiEventForm.bind(
    null,
    props.idCopyFrom,
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

  const generateFieldNames = (prefix: string) => {
    return Array.from({ length: SLOTS_PER_TAB }, (_, i) => `${prefix}${i}`);
  };

  const gigDateFieldNames = generateFieldNames("gigDate");
  const timeStartFieldNames = generateFieldNames("timeStart");
  const timeEndFieldNames = generateFieldNames("timeEnd");

  return (
    <form
      action={formAction}
      ref={ref}
      className="  grid  grid-cols-12 items-center justify-center gap-3"
    >
      <Card className="h-full w-full p-4">
        <CardHeader className="px-0">
          <CardTitle>Create Multi-Event</CardTitle>
        </CardHeader>
        <CardContent className=" ">
          <Tabs
            defaultValue="tab-1"
            className={cn("relative w-full overflow-x-auto")}
            orientation="horizontal"
          >
            <TabsList>
              {Array.from(TABS).map((tab) => (
                <TabsTrigger key={tab.id} value={tab.value}>
                  {tab.value}
                </TabsTrigger>
              ))}
            </TabsList>
            {Array.from(TABS).map((tab, tabIndex) => (
              <TabsContent
                key={`${tab.id}-content`}
                value={tab.value}
                className="col-span-4 grid w-full gap-2"
              >
                {Array.from({ length: SLOTS_PER_TAB }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2">
                    <div className="col-span-2 flex w-full flex-row items-center gap-2">
                      <span>{tabIndex * SLOTS_PER_TAB + i + 1}</span>
                      <Label className="col-span-3">
                        <DatePicker
                          id="gigDate"
                          name="gigDate"
                          imperativeHandleRef={datePickerImperativeHandleRef}
                        />
                        <span>Gig Date</span>
                      </Label>

                      <Label className="col-span-1">
                        <Input type="time" name="timeStart" />
                        <span>Start</span>
                      </Label>

                      <Label className="col-span-1">
                        <Input type="time" name="timeEnd" />
                        <span>End</span>
                      </Label>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
