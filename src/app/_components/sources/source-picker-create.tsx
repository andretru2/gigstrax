"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { type ParsedSearchParams } from "../search-params";
// import { useQueryState } from "nuqs";
import { submitSource } from "@/app/_actions/source";
import { type SantaType } from "@/types/index";
import { useFormState } from "react-dom";
// import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { useFormFeedback } from "../form/use-form-feedback";
import { toast } from "sonner";
import { SubmitButton } from "../form/submit-button";

// import { useQueryStates } from "nuqs";

interface Props {
  searchParams?: ParsedSearchParams;
  gigId?: string | undefined;
  role?: SantaType;
  goto?: boolean | undefined;
}

export function SourcePickerCreate(props: Props) {
  // console.log(props);
  // const [open, setOpen] = useQueryState(
  //   props.role === "RBS" ? "modalOpenSanta" : "modalOpenMrsSanta",
  //   modalOpenParser,
  // );
  // const submitWithProps = props.goto
  //   ? submitSource.bind(null, props.goto )
  //   : submitSource;

  const [formState, formAction] = useFormState(submitSource, EMPTY_FORM_STATE);

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

  // const handleCreate = () => {
  //   startTransition(async () => {
  //     const data = {
  //       nameFirst: source,
  //       nameRole: source,
  //       role: source,
  //       status: "Active",
  //     };

  //     const { sourceId } = await createSource(data);
  //     console.log("sourceId", sourceId);
  //     props.gigId &&
  //       void handleSaveGig({
  //         id: props.gigId,
  //         key: props.role === "RBS" ? "santaId" : "mrsSantaId",
  //         value: sourceId,
  //       });
  //     void setOpen(!open);
  //   });
  // };

  return (
    <Card className="h-full w-full p-4">
      <CardHeader>
        <CardTitle className="pl-2">Create new</CardTitle>
      </CardHeader>
      <CardContent className="">
        <form
          action={formAction}
          ref={ref}
          className="form flex w-full flex-col  gap-4"
        >
          <Label className="font-medium">
            <Input name={"nameFirst"} />
            <span>First</span>
          </Label>
          <Label className="font-medium">
            <Input name={"nameLast"} />
            <span>Last</span>
          </Label>
          {/* {!props.role && (
            <Label className="py-4 font-medium">
              <RadioGroup name="roleType" defaultValue={"RBS"} >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Santa(RBS)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mrs.Santa" id="r2" />
                  <Label htmlFor="r2">Mrs. Santa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="r3" />
                  <Label htmlFor="r3">Other</Label>
                </div>
              </RadioGroup>
              <span>Role Type</span>
            </Label>
          )}

          <Label className="font-medium">
            <Input
              placeholder="Nickname . i.e. RBS Joe "
              name={props.role === "RBS" ? "santaId" : "mrsSantaId"}
            />
            <span>Role </span>
          </Label> */}
          <SubmitButton />
          <noscript>
            {formState.status === "ERROR" && (
              <div style={{ color: "red" }}>{formState.message}</div>
            )}

            {formState.status === "SUCCESS" && (
              <div style={{ color: "green" }}>{formState.message}</div>
            )}
          </noscript>
        </form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
