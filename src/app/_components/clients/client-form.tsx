"use client";

import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/form/field-error";
import { useFormFeedback } from "@/components/form/use-form-feedback";
import { EMPTY_FORM_STATE } from "@/components/form/to-form-state";
import { ClientType, type Client } from "@prisma/client";
import { useQueryStates, parseAsBoolean, useQueryState } from "nuqs";
import { submitClient } from "@/app/_actions/client";
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
  type SaveClientProps,
  handleSaveClient,
} from "@/lib/client/handle-save-client";
import { type FocusEvent } from "react";

export function ClientForm(props: Awaited<Partial<Client>>) {
  const { id } = props;
  const [fieldError, setFieldError] = useQueryStates(fieldErrorParser);
  const submitClientWithId = submitClient.bind(null, id);
  const [formState, formAction] = useFormState(
    submitClientWithId,
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

  async function handleSaveClientWrapper(props: SaveClientProps) {
    const resultSave = await handleSaveClient(props);
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
      <Card className="col-span-12 p-2">
        <CardHeader className="">
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent className="form  grid grid-cols-6 gap-4   p-4">
          <ClientDetails
            {...props}
            handleSaveClientWrapper={handleSaveClientWrapper}
            fieldError={fieldError}
            setFieldError={setFieldError}
            formState={formState}
          />
        </CardContent>
      </Card>
    </form>
  );
}

interface FormProps {
  handleSaveClientWrapper: (props: SaveClientProps) => Promise<void>;
  fieldError: { key: string | null; error: string | null };
  setFieldError: (props: { key: string | null; error: string | null }) => void;
  formState: { status: string; message: string };
}

function ClientDetails({
  handleSaveClientWrapper,
  fieldError,
  setFieldError,
  formState,
  ...props
}: Partial<Client> & FormProps) {
  const {
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    client,
    clientType,
    contact,
    email,
    id,
    notes,
    phoneCell,
    phoneLandline,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  } = props;

  console.log(client);

  return (
    <>
      <Label className="col-span-6">
        <Input
          name="client"
          defaultValue={client ? client : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
              value: e.target.value,
            })
          }
        />
        <span>Client</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "client" ? fieldError.error : null}
          name="client"
        />
      </Label>

      <Label className="col-span-6">
        <Input
          name="contact"
          defaultValue={contact ? contact : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
              value: e.target.value,
            })
          }
        />
        <span>Contact</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "contact" ? fieldError.error : null}
          name="contact"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="phoneCell"
          defaultValue={phoneCell ? phoneCell : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
              value: e.target.value,
            })
          }
        />
        <span>Contact Phone (Cell)</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "phoneCell" ? fieldError.error : null}
          name="phoneCell"
        />
      </Label>

      <Label className="col-span-2">
        <Input
          name="phoneLandline"
          defaultValue={phoneLandline ? phoneLandline : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
              value: e.target.value,
            })
          }
        />
        <span>Contact Phone (Landline)</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "phoneLandline" ? fieldError.error : null}
          name="phoneLandline"
        />
      </Label>

      <Label className="col-span-2">
        <Select
          name="clientType"
          defaultValue={clientType ? clientType : undefined}
          onValueChange={(value: ClientType) => {
            void handleSaveClientWrapper({
              id: id,
              key: "clientType",
              value: value,
            });
          }}
        >
          <SelectTrigger className="bg-white capitalize">
            <SelectValue placeholder={clientType} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.values(ClientType).map((option) => (
                <SelectItem key={option} value={option} className="capitalize">
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <span>Client Type</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "clientType" ? fieldError.error : null}
          name="clientType"
        />
      </Label>

      <Label className="col-span-6">
        <Input
          name="email"
          defaultValue={email ? email : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
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

      <Label className="col-span-6">
        <Input
          name="addressStreet"
          defaultValue={addressStreet ? addressStreet : undefined}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
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
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
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
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
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
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
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
            void handleSaveClientWrapper({
              id: id,
              key: e.target.name as keyof Client,
              value: e.target.value,
            })
          }
        />
        <span>Notes for Client</span>
        <FieldError
          formState={formState}
          error={fieldError.key === "notes" ? fieldError.error : null}
          name="notes"
        />
      </Label>
    </>
  );
}
