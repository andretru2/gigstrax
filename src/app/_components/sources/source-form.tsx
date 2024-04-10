"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/form/field-error";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { Gender, SourceStatus, type Source } from "@prisma/client";
import { useQueryStates } from "nuqs";
import { submitSource } from "@/app/_actions/source";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { fieldErrorParser } from "../search-params";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  type SaveSourceProps,
  handleSaveSource,
} from "@/lib/source/handle-save-source";
import { type FocusEvent } from "react";
import { Separator } from "../ui/separator";

export function SourceForm(props: Awaited<Partial<Source>>) {
  const { id } = props;
  const [fieldError, setFieldError] = useQueryStates(fieldErrorParser);
  const submitSourceWithId = submitSource.bind(null, id);
  const [formState, formAction] = useFormState(
    submitSourceWithId,
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

  async function handleSaveSourceWrapper(props: SaveSourceProps) {
    const resultSave = await handleSaveSource(props);
    if (resultSave.result === "Error") {
      void setFieldError({
        key: props.key,
        error: resultSave.resultDescription,
      });
    }
    void setFieldError({ key: null, error: null });
  }

  return (
    <form
      action={formAction}
      ref={ref}
      className="  grid  grid-cols-12 items-center justify-center gap-3"
    >
      <Card className="col-span-12 p-4">
        <CardHeader className="">
          <CardTitle>Source Details</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="form  grid grid-cols-6 gap-4   ">
          <SourceDetails
            {...props}
            handleSaveSourceWrapper={handleSaveSourceWrapper}
            fieldError={fieldError}
            formState={formState}
          />
        </CardContent>
      </Card>
    </form>
  );
}

interface FormProps {
  handleSaveSourceWrapper: (props: SaveSourceProps) => Promise<void>;
  fieldError: { key: string | null; error: string | null };
  setFieldError?: (props: { key: string | null; error: string | null }) => void;
  formState: { status: string; message: string };
}

function SourceDetails({
  handleSaveSourceWrapper,
  fieldError,
  formState,
  ...props
}: Partial<Source> & FormProps) {
  const {
    id,
    role,
    nameFirst,
    nameLast,
    email,
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    gigMastersAccount,
    notes,
    // createdAt,
    // updatedAt,
    // createdBy,
    // dob,
    // updatedBy,
    status,
    // entity,
    phone,
    // resource,
    website,
    ssn,
    videoUrl,
    gender,
    costume,
  } = props;

  return (
    <>
      <Label className="col-span-2">
        <Input
          name="nameFirst"
          defaultValue={nameFirst ? nameFirst : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>First</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "nameFirst" ? fieldError.error : null}
          name="nameFirst"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="nameLast"
          defaultValue={nameLast ? nameLast : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Last</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "nameLast" ? fieldError.error : null}
          name="nameLast"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="phone"
          defaultValue={phone ? phone : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Phone</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "phone" ? fieldError.error : null}
          name="phone"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="email"
          defaultValue={email ? email : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Email</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "email" ? fieldError.error : null}
          name="email"
        />
      </Label>

      <Label className="col-span-2">
        <Select
          name="gender"
          defaultValue={gender ? gender : undefined}
          onValueChange={(value: Gender) => {
            void handleSaveSourceWrapper({
              id: id,
              key: "gender",
              value: value,
            });
          }}
        >
          <SelectTrigger className="bg-white capitalize">
            <SelectValue placeholder={gender} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(Gender).map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span>Gender</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "gender" ? fieldError.error : null}
          name="gender"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="role"
          defaultValue={role ? role : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Role</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "role" ? fieldError.error : null}
          name="role"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="ssn"
          defaultValue={ssn ? ssn : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>SSN</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "ssn" ? fieldError.error : null}
          name="ssn"
        />
      </Label>

      <Label className="col-span-2">
        <Select
          name="status"
          defaultValue={status ? status : undefined}
          onValueChange={(value: SourceStatus) => {
            void handleSaveSourceWrapper({
              id: id,
              key: "status",
              value: value,
            });
          }}
        >
          <SelectTrigger className="bg-white capitalize">
            <SelectValue placeholder={status} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(SourceStatus).map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span>Status</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "status" ? fieldError.error : null}
          name="status"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="gigMastersAccount"
          defaultValue={gigMastersAccount ? gigMastersAccount : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Gig Masters Account</span>
        <FieldError
          formState={formState}
          error={
            fieldError.key === "gigMastersAccount" ? fieldError.error : null
          }
          name="gigMastersAccount"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="videoUrl"
          defaultValue={videoUrl ? videoUrl : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Video Url</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "videoUrl" ? fieldError.error : null}
          name="videoUrl"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="website"
          defaultValue={website ? website : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Website</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "website" ? fieldError.error : null}
          name="website"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="costume"
          defaultValue={costume ? costume : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Costume</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "costume" ? fieldError.error : null}
          name="costume"
        />
      </Label>

      <Label className="col-span-6">
        <Input
          name="addressStreet"
          defaultValue={addressStreet ? addressStreet : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Address (Street)</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "addressStreet" ? fieldError.error : null}
          name="addressStreet"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="addressCity"
          defaultValue={addressCity ? addressCity : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>City</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "addressCity" ? fieldError.error : null}
          name="addressCity"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="addressState"
          defaultValue={addressState ? addressState : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>State</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "addressState" ? fieldError.error : null}
          name="addressState"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="addressZip"
          defaultValue={addressZip ? addressZip : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Zip</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "addressZip" ? fieldError.error : null}
          name="addressZip"
        />
      </Label>

      <Label className="col-span-6">
        <Textarea
          name="notes"
          defaultValue={notes ? notes : undefined}
          onBlur={(e: FocusEvent<HTMLTextAreaElement>) =>
            void handleSaveSourceWrapper({
              id: id,
              key: e.target.name as keyof Source,
              value: e.target.value,
            })
          }
        />
        <span>Notes</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "notes" ? fieldError.error : null}
          name="notes"
        />
      </Label>
    </>
  );
}
