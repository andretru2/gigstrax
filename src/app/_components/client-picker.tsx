"use client";

import { useImperativeHandle } from "react";

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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { useQueryState } from "nuqs";

import { type ClientPickerProps } from "@/types/index";
import { Icons } from "./icons";
import { Input } from "./ui/input";
import { useDebounceCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/lib/utils";

interface Props {
  clients?: ClientPickerProps[];
  suggestions?: ClientPickerProps[];
  id: string;
  name: string;
  defaultValue?: ClientPickerProps | undefined;
  imperativeHandleRef: React.RefObject<{
    reset: () => void;
  }>;
  onSelect?: (clientId: string) => void;
}

export function ClientPicker(props: Props) {
  const { id, name, defaultValue, imperativeHandleRef } = props;

  //   const [client, setClient] = useState<ClientPickerProps | undefined>(
  //     defaultValue ? defaultValue : undefined,
  //   );

  useImperativeHandle(
    imperativeHandleRef,
    () => ({
      reset() {
        setClient(undefined);
      },
    }),
    [],
  );

  const clientName = defaultValue
    ? defaultValue.client
    : "Please select a client";

  return (
    <Drawer>
      <DrawerTrigger id={id} className="w-full justify-start text-left" asChild>
        <Button variant="outline">
          <Icons.user className=" mr-2 size-3" />
          {clientName}
          <Input type="hidden" name={name} value={clientName} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Client Picker</DrawerTitle>
            <DrawerDescription>Select the client.</DrawerDescription>
          </DrawerHeader>
          <Search {...props} />
        </div>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Search(props: Props) {
  const [query, setQuery] = useQueryState("clientQuery");
  //   const debouncedQuery = useDebounceCallback(query, 300);

  const handleSearch = useDebounceCallback((query) => {
    console.log(query);
    setQuery(query), 50;
  });

  return (
    <Command className="flex  flex-col gap-3 border p-4">
      <h1>Search Clients</h1>
      <CommandInput
        placeholder="Type to search..."
        value={query || undefined}
        onValueChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          void handleSearch(e);
        }}
      />

      <CommandList className="">
        <CommandSeparator />
        <CommandEmpty>No results found.</CommandEmpty>
        {/* <CommandGroup heading={client ? "Results" : ""}> */}
        <CommandGroup heading="Results">
          {props.clients &&
            props.clients.map((client) => (
              <CommandItem
                value={client.client}
                key={client.id}
                defaultValue={query}
                onSelect={() => {
                  void setQuery(null);
                  props.onSelect && props.onSelect(client.id);
                }}
              >
                {client.client}

                <Icons.check
                  className={cn(
                    "ml-auto h-4 w-4",
                    props.defaultValue
                      ? client.client === props.defaultValue.client
                      : false
                        ? "opacity-100"
                        : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
}
