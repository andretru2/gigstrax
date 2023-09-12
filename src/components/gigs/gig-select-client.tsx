"use client";

import { type Control, useController } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Input } from "../ui/input";
import { type FocusEvent, useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import ClientCreate from "../clients/client-create";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { update } from "@/app/_actions/gig";
import { getClient, getClients } from "@/app/_actions/client";
import { toast } from "@/hooks/use-toast";
import { type ClientPickerProps } from "@/types/index";
import { type ClientProps } from "@/server/db";
import { useGigStore } from "@/app/_store/gig";

export function SelectClient({
  gigId,
  control,
  name,
}: {
  gigId: string;
  control: Control;
  name: string;
}) {
  const { field } = useController({ control, name });
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [clients, setClients] = useState<ClientPickerProps[] | null>(null);
  const [clientSuggestions, setClientSuggestions] = useState<
    ClientPickerProps[] | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const { client, setClient } = useGigStore();

  const getClientSuggestions = async () => {
    const { data } = await getClients({
      whereClause: {
        client: {
          not: {
            equals: "",
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { client: "asc" }],
      limit: 5,
    });
    setClientSuggestions(data);
  };

  const handlePopoverOpen = () => {
    void getClientSuggestions();
    setIsOpen(true);
  };

  function handleSelectClient(value: string) {
    startTransition(async () => {
      try {
        console.log(value, gigId);
        const [updateGig, clientUpdate] = await Promise.all([
          update({ id: gigId, clientId: value }),
          getClient(value),
        ]);
        setIsOpen(false);
        setClient(clientUpdate as ClientProps);
        router.refresh();
      } catch (error) {
        error instanceof Error
          ? toast({
              description: error.message,
            })
          : toast({
              description: "Something went wrong, please try again.",
            });
      }
    });
  }

  useEffect(() => {
    if (debouncedQuery.length === 0) setClients(null);

    if (debouncedQuery.length > 0) {
      startTransition(async () => {
        const { data } = await getClients({
          select: {
            id: true,
            client: true,
          },
          whereClause: {
            client: {
              contains: debouncedQuery,
              mode: "insensitive",
            },
          },

          orderBy: [{ client: "asc" }],
        });
        console.log(data);
        data && setClients(data);
      });
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  // useEffect(() => {
  //   const searchClient = () => {
  //     setSearchClientResults([]);
  //     if (debouncedSearchClient.length > 1 && clients) {
  //       setIsLoading(true);
  //       const searchClientResults = clients.filter(({ client }) =>
  //         client.toLowerCase().includes(debouncedSearchClient)
  //       );
  //       setSearchClientResults(searchClientResults);
  //       setIsLoading(false);
  //     }
  //   };

  //   searchClient();
  // }, [debouncedSearchClient, clients]);

  return (
    <FormItem className=" col-span-3 flex flex-col ">
      <FormLabel>Client</FormLabel>
      <Popover open={isOpen} onOpenChange={handlePopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {client?.client ? <>{client.client}</> : <>Select Client...</>}
              {isPending ? (
                <Icons.spinner className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <Icons.arrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent className=" h-max w-[420px] p-0 " side="right">
          <Command className="flex  flex-col gap-3 border p-4">
            {/* <CommandInput placeholder="Search..."  /> */}
            <h1>Search Clients</h1>
            <CommandInput
              placeholder="Type to search..."
              value={query}
              onValueChange={setQuery}
            />
            {/* <Input
              onChange={handleClientSearch}
              placeholder="Type to search..."
            /> */}
            <CommandList>
              <CommandSeparator />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Results">
                {clients &&
                  clients.map((client) => (
                    <CommandItem
                      value={client.client}
                      key={client.id}
                      onSelect={() => handleSelectClient(client.id)}
                    >
                      {client.client}

                      <Icons.check
                        className={cn(
                          "ml-auto h-4 w-4",
                          client.client === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Suggestions">
                {clientSuggestions &&
                  clientSuggestions.map((client) => (
                    <CommandItem
                      value={client.client}
                      key={client.id}
                      onSelect={() => handleSelectClient(client.id)}
                    >
                      {client.client}
                      <Icons.check
                        className={cn(
                          "ml-auto h-4 w-4",
                          client.client === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup className="" heading="Create new">
                <CommandItem className="flex flex-col gap-2 data-[selected]:bg-none">
                  <ClientCreate
                    onSuccess={(newClientId) => {
                      handleSelectClient(newClientId);
                      setIsOpen(false);
                    }}
                  />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
