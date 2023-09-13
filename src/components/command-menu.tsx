"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type DialogProps } from "@radix-ui/react-alert-dialog";
// import { CircleIcon, FileIcon, LaptopIcon } from "@radix-ui/react-icons";

import { Icons } from "./icons";
// import { useTheme } from "next-themes"

// import { docsConfig } from "@/config/docs"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  // const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        {/* <span className="hidden lg:inline-flex">Search documentation...</span> */}
        <Icons.search className="h-4 w-4 xl:mr-2" aria-hidden="true" />
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className=" text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {/* <CommandGroup heading="Gigs">
            <CommandItem
              key={navItem.href}
              value={navItem.title}
              onSelect={() => {
                navItem?.href && runCommand(() =>  router.push(navItem.href as string))};
              }}
            >
              <Icons.page className="mr-2 h-4 w-4" />
              Gigs (under construction)
            </CommandItem>
          </CommandGroup> */}

          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
