"use client";

import { useImperativeHandle, useState } from "react";

import { Button } from "@/components/ui/button";
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

import { type ClientPickerProps } from "@/types/index";
import { Icons } from "./icons";

interface Props {
  clientSuggestions?: ClientPickerProps[];
  id: string;
  name: string;
  defaultValue?: ClientPickerProps;
  imperativeHandleRef: React.RefObject<{
    reset: () => void;
  }>;
  onSelect?: (ClientPickerProps: string) => void;
}

export function ClientPicker(props: Props) {
  const { id, name, defaultValue, imperativeHandleRef, onSelect } = props;

  const [client, setClient] = useState<ClientPickerProps | undefined>(
    defaultValue ? defaultValue : undefined,
  );

  useImperativeHandle(
    imperativeHandleRef,
    () => ({
      reset() {
        setClient(undefined);
      },
    }),
    [],
  );

  const clientName = client ? client.client : "Please select a client";

  return (
    <Drawer>
      <DrawerTrigger id={id} className="w-full justify-start text-left" asChild>
        <Button variant="outline">
          <Icons.user className=" mr-2 size-4" />
          {clientName}
          <input type="hidden" name={name} value={clientName} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Client Picker</DrawerTitle>
            <DrawerDescription>Set the client for this gig.</DrawerDescription>
          </DrawerHeader>
        </div>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
  <div className="h-full w-full">Client Picker</div>;

  // const [clientSuggestions, setClientSuggestions] = useState<string[]>(props.clientSuggestions || []);

  // return (
  //     <div>
  //         <input type="text" list="client-suggestions" />
  //         <datalist id="client-suggestions">
  //             {clientSuggestions.map((client, index) => (
  //                 <option key={index} value={client} />
  //             ))}
  //         </datalist>
  //     </div>
  // );
}
