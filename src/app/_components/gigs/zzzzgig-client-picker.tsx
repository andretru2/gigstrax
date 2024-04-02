"use client";

import { update } from "@/app/_actions/gig";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
// import { ClientPicker } from "../client-picker";
import { ClientPicker } from "@/components/clients/client-picker";
import { Button } from "@/components/ui/button";

import { Icons } from "./icons";

// import { type Client as ClientProps } from "@prisma/client";
import { useFormState } from "react-dom";
import { EMPTY_FORM_STATE } from "../form/to-form-state";
import { FieldError } from "../form/field-error";
import { startTransition, useState } from "react";

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

interface Props {
  gigId: string;
  clientPicker: React.ReactElement;

}

export function GigClientPicker(props: Props) {
  console.log("gigclientprops", props);
  const { gigId } = props;
  //   const { id: clientId, client } = props.client;

  const updateGigWithId = update.bind(null, gigId);

  const [formState, formAction] = useFormState(
    updateGigWithId,
    EMPTY_FORM_STATE,
  );

  const [fieldError, setFieldError] = useState<
    Record<string, string | null | undefined>
  >({});

  const handleUpdate = async (clientId: string): Promise<void> => {
    if (!clientId) return;

    const key = "clientId";
    const formData = new FormData();
    formData.append(key, clientId);

    const res = await update(gigId, formState, formData);
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

  return (
    <form
      action={formAction}
      //   ref={ref}
      className="form grid w-full  grid-cols-12  gap-x-4 gap-y-6"
    >
      <Label className="col-span-3 row-start-2">
        <props.clientPicker />

        <FieldError
          formState={formState}
          error={fieldError.key === "clientId" ? fieldError.error : null}
          name="clientId"
        />
      </Label>
    </form>
  );
}
