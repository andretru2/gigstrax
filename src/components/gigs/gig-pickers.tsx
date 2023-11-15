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
import {
  getGig,
  getMrsSantasByAvailability,
  getSantasByAvailability,
  update,
} from "@/app/_actions/gig";
import { getClient, getClients } from "@/app/_actions/client";
import { toast } from "@/hooks/use-toast";
import {
  type ClientPickerProps,
  type SantaProps,
  type MrsSantaProps,
} from "@/types/index";
import { useGigStore } from "@/app/_store/gig";
import SourceCreate from "../sources/source-create";

export function PickClient({
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
      // whereClause: {
      //   client: {
      //     not: {
      //       equals: "",
      //     },
      //   },
      // },
      // orderBy: [{ createdAt: "desc" }, { client: "asc" }],
      orderBy: [{ updatedAt: { sort: "desc", nulls: "last" } }],

      limit: 5,
    });
    setClientSuggestions(data);
  };

  const handlePopoverOpen = () => {
    void getClientSuggestions();
    setIsOpen(!isOpen);
  };

  function handleSelectClient(value: string) {
    startTransition(async () => {
      try {
        const [updateGig, clientUpdate] = await Promise.all([
          update({ id: gigId, clientId: value }),
          getClient(value),
        ]);
        setIsOpen(false);
        clientUpdate && setClient(clientUpdate);
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

  function handleClearClient() {
    startTransition(async () => {
      try {
        await update({ id: gigId, clientId: null });
        setClient(undefined);
        setIsOpen(false);
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

  return (
    <FormItem className=" col-span-3 flex flex-col ">
      <FormLabel>Client</FormLabel>
      <Popover open={isOpen} onOpenChange={handlePopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-white"
            >
              {client?.client ? <>{client.client}</> : <>Pick Client...</>}
              {isPending ? (
                <Icons.spinner className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <Icons.arrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent className=" h-[650px] w-[500px] p-2 " side="bottom">
          <Command className="flex  flex-col gap-3 border p-4">
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
            <CommandList className="max-h-[500px]">
              <CommandSeparator />
              <CommandEmpty>No results found.</CommandEmpty>
              {/* <CommandGroup heading={client ? "Results" : ""}> */}
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
                <CommandItem className="flex flex-col gap-2 self-end bg-none aria-selected:bg-inherit ">
                  <ClientCreate
                    onSuccess={(newClientId) => {
                      handleSelectClient(newClientId);
                    }}
                  />
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup className="" heading="Clear">
                <CommandItem className="flex flex-col gap-2 self-end bg-none aria-selected:bg-inherit">
                  <Button
                    variant={"secondary"}
                    isLoading={isPending}
                    onClick={handleClearClient}
                  >
                    Clear
                  </Button>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}

export function PickSanta({
  gigId,
  timeStart,
  timeEnd,
  gigDate,
  initialSanta,
}: {
  gigId: string;
  timeStart: Date;
  timeEnd: Date;
  gigDate: Date;
  initialSanta: SantaProps | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedSanta, setSelectedSanta] = useState<SantaProps | null>(
    initialSanta
  );
  const [available, setAvailable] = useState<SantaProps[] | null>(null);
  const [unavailable, setUnavailable] = useState<SantaProps[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (!gigDate || !timeStart || !timeEnd) return;
      getSantasByAvailability(gigId)
        .then(({ available, unavailable }) => {
          setAvailable(available);
          setUnavailable(unavailable);
        })
        .catch((error) => {
          error instanceof Error
            ? toast({
                description: error.message,
              })
            : toast({
                description: "Something went wrong, please try again.",
              });
        });
    });
  }, [timeStart, timeEnd, gigDate, gigId]);

  const handlePopoverOpen = () => {
    setIsOpen(!isOpen);
  };

  function handleSelectSanta(props: SantaProps) {
    startTransition(() => {
      update({ id: gigId, santaId: props.id })
        .then((updatedGig) => {
          setSelectedSanta(props);
          setIsOpen(false);
          // router.refresh();
        })
        .catch((error) => {
          error instanceof Error
            ? toast({
                description: error.message,
              })
            : toast({
                description: "Something went wrong, please try again.",
              });
        });
    });
  }

  function handleClearSanta() {
    startTransition(async () => {
      try {
        await update({ id: gigId, clientId: null });
        setSelectedSanta(null);
        setIsOpen(false);
        // router.refresh();
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

  return (
    <FormItem className=" col-span-3 flex flex-col ">
      <FormLabel>Santa</FormLabel>
      <Popover open={isOpen} onOpenChange={handlePopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-white"
            >
              {selectedSanta?.role ? (
                <>{selectedSanta?.role}</>
              ) : (
                <>Pick Santa...</>
              )}
              {isPending ? (
                <Icons.spinner className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <Icons.arrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent className=" h-[650px] w-[500px] p-2 " side="bottom">
          <Command className="flex  flex-col gap-3 border p-4">
            <CommandList className="max-h-[650px]">
              <CommandSeparator />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Available">
                {available &&
                  available.map((santa) => (
                    <CommandItem
                      value={santa.id}
                      key={santa.id}
                      onSelect={() => handleSelectSanta(santa)}
                    >
                      {santa.role}

                      <Icons.check
                        className={cn(
                          "ml-auto h-4 w-4",
                          santa.id === selectedSanta?.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Unavailable">
                {unavailable &&
                  unavailable.map((santa) => (
                    <CommandItem
                      value={santa.id}
                      key={santa.id}
                      onSelect={() => handleSelectSanta(santa)}
                    >
                      {santa.role}

                      <Icons.check
                        className={cn(
                          "ml-auto h-4 w-4",
                          santa.id === selectedSanta?.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup className="" heading="Create new">
                <CommandItem className="flex  flex-col gap-2 self-end bg-none aria-selected:bg-inherit">
                  <SourceCreate
                    role="RBS"
                    onSuccess={(newSourceId, role) => {
                      handleSelectSanta({ id: newSourceId, role: role });
                    }}
                  />
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup className="" heading="Clear">
                <CommandItem className="flex flex-col gap-2 self-end bg-none aria-selected:bg-inherit">
                  <Button
                    variant={"secondary"}
                    isLoading={isPending}
                    onClick={handleClearSanta}
                  >
                    Clear
                  </Button>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}

export function PickMrsSanta({
  gigId,
  timeStart,
  timeEnd,
  gigDate,
  initialMrsSanta,
}: {
  gigId: string;
  timeStart: Date;
  timeEnd: Date;
  gigDate: Date;
  initialMrsSanta: MrsSantaProps | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMrsSanta, setSelectedMrsSanta] =
    useState<MrsSantaProps | null>(initialMrsSanta);
  const [available, setAvailable] = useState<MrsSantaProps[] | null>(null);
  const [unavailable, setUnavailable] = useState<MrsSantaProps[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (!gigDate || !timeStart || !timeEnd) return;
      getMrsSantasByAvailability(gigId)
        .then(({ available, unavailable }) => {
          setAvailable(available);
          setUnavailable(unavailable);
        })
        .catch((error) => {
          error instanceof Error
            ? toast({
                description: error.message,
              })
            : toast({
                description: "Something went wrong, please try again.",
              });
        });
    });
  }, [timeStart, timeEnd, gigDate, gigId]);

  const handlePopoverOpen = () => {
    setIsOpen(!isOpen);
  };

  function handleSelectMrsSanta(props: MrsSantaProps) {
    startTransition(() => {
      update({ id: gigId, mrsSantaId: props.id })
        .then((updatedGig) => {
          setSelectedMrsSanta(props);
          setIsOpen(false);
          // router.refresh();
        })
        .catch((error) => {
          error instanceof Error
            ? toast({
                description: error.message,
              })
            : toast({
                description: "Something went wrong, please try again.",
              });
        });
    });
  }

  function handleClearMrsSanta() {
    startTransition(async () => {
      try {
        await update({ id: gigId, clientId: null });
        setSelectedMrsSanta(null);
        setIsOpen(false);
        // router.refresh();
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

  return (
    <FormItem className=" col-span-3 flex flex-col ">
      <FormLabel>MrsSanta</FormLabel>
      <Popover open={isOpen} onOpenChange={handlePopoverOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between bg-white"
            >
              {selectedMrsSanta?.role ? (
                <>{selectedMrsSanta?.role}</>
              ) : (
                <>Pick MrsSanta...</>
              )}
              {isPending ? (
                <Icons.spinner className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <Icons.arrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>

        <PopoverContent className=" h-[650px] w-[500px] p-2 " side="bottom">
          <Command className="flex  flex-col gap-3 border p-4">
            <CommandList className="max-h-[650px]">
              <CommandSeparator />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Available">
                {available &&
                  available.map((MrsSanta) => (
                    <CommandItem
                      value={MrsSanta.id}
                      key={MrsSanta.id}
                      onSelect={() => handleSelectMrsSanta(MrsSanta)}
                    >
                      {MrsSanta.role}

                      <Icons.check
                        className={cn(
                          "ml-auto h-4 w-4",
                          MrsSanta.id === selectedMrsSanta?.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Unavailable">
                {unavailable &&
                  unavailable.map((MrsSanta) => (
                    <CommandItem
                      value={MrsSanta.id}
                      key={MrsSanta.id}
                      onSelect={() => handleSelectMrsSanta(MrsSanta)}
                    >
                      {MrsSanta.role}

                      <Icons.check
                        className={cn(
                          "ml-auto h-4 w-4",
                          MrsSanta.id === selectedMrsSanta?.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup className="" heading="Create new">
                <CommandItem className="flex flex-col gap-2 self-end bg-none aria-selected:bg-inherit">
                  <ClientCreate
                    onSuccess={(newClientId) => {
                      handleSelectMrsSanta(newClientId);
                    }}
                  />
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup className="" heading="Clear">
                <CommandItem className="flex flex-col gap-2 self-end bg-none aria-selected:bg-inherit">
                  <Button
                    variant={"secondary"}
                    isLoading={isPending}
                    onClick={handleClearMrsSanta}
                  >
                    Clear
                  </Button>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
