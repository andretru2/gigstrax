"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// import { type Product } from "@/db/schema";

import { cn, formatDate, isMacOs } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "@/components/icons";
import { type GetGigsProps } from "../types";
import { getGigs } from "@/app/_actions/gig";

import { type GigExtendedProps } from "../types";

export function Combobox() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [data, setData] = useState<
    Pick<GigExtendedProps, "id" | "gigDate" | "client.client">[] | null
  >(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (debouncedQuery.length === 0) setData(null);

    if (debouncedQuery.length > 0) {
      startTransition(async () => {
        const { data } = await getGigs({
          select: {
            id: true,
            gigDate: true,
            client: {
              select: {
                client: true,
              },
            },
          },
          whereClause: {
            client: {
              client: {
                contains: debouncedQuery,
                mode: "insensitive",
              },
            },
          },
          orderBy: [{ gigDate: "desc" }],
        });
        console.log(data);
        data && setData(data);
      });
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = useCallback((callback: () => unknown) => {
    setIsOpen(false);
    callback();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  console.log(data, isPending);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setIsOpen(true)}
      >
        <Icons.search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search gigs/clients...</span>
        <span className="sr-only">Search Gigs</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <abbr title={isMacOs() ? "Command" : "Control"}>
            {isMacOs() ? "⌘" : "Ctrl+"}
          </abbr>
          K
        </kbd>
      </Button>
      <CommandDialog position="top" open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Type to search..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
          >
            No records found.
          </CommandEmpty>
          {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            <CommandGroup key="Gig" className="capitalize" heading="Gig">
              {data?.map((gig) => (
                <CommandItem
                  key={gig.id}
                  onSelect={() =>
                    gig.id &&
                    handleSelect(() => router.push(`/dashboard/gigs/${gig.id}`))
                  }
                >
                  {gig.gigDate && formatDate(gig.gigDate, "formal")} |{" "}
                  {gig.client.client}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
