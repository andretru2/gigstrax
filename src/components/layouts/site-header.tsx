import Link from "next/link";

import type { User } from "@clerk/nextjs/dist/types/server";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/command-menu";
import { Icons } from "@/components/icons";
// import { MainNav } from "@/components/main-nav"
// import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const user = "atb";

interface SiteHeaderProps {
  user: User | null;
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const initials = `${user?.firstName?.charAt(0) ?? ""} ${
    user?.lastName?.charAt(0) ?? ""
  }`;
  const email =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? "";
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center gap-3">
        {/* <MainNav /> */}
        {/* <MobileNav /> */}

        <Icons.logo className="h-8 w-8 " />

        <h1>
          Real Beard{" "}
          <span className="bg-gradient-to-r from-green-400 to-red-500 bg-clip-text text-transparent">
            Santas
          </span>
        </h1>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            {/* <Link
              href={siteConfig.links.github}
              // target="_blank"
              // rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.user className="h-5 w-5" />
                <span className="sr-only">User</span>
              </div>
            </Link> */}
            <Link
              href={siteConfig.links.twitter}
              // target="_blank"
              // rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.settings className="h-5 w-5 fill-current" />
                <span className="sr-only">Settings</span>
              </div>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.username ?? ""}
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/account">
                        <Icons.user
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Account
                        <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild disabled>
                      <Link href="/dashboard/settings">
                        <Icons.settings
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/signout">
                      <Icons.logout
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/signin">
                <div
                  className={buttonVariants({
                    size: "sm",
                  })}
                >
                  Sign In
                  <span className="sr-only">Sign In</span>
                </div>
              </Link>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
