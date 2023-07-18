"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// import { type NavItem } from "types";
import type { NavItem } from "../../types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Icons } from "@/components/icons";
// import Logo from "@/components/logo";
// import useIdle from "@/hooks/use-idle";
// import { signOut } from "next-auth/react";

import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Props {
  items: NavItem[];
}

export default function SidebarNav({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();
  // const logout = () =>
  //   signOut({
  //     callbackUrl: env("NEXTAUTH_URL"),
  //   });
  // useIdle({ onIdle: signOut, idleTime: 300 });

  if (!items?.length) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        isOpen ? "w-[220px]" : "w-[96px]",
        " relative   from-red-500 to-red-600 bg-gradient-to-tr transition-all duration-200  "
      )}
    >
      <aside className=" flex flex-col gap-12 ">
        <Icons.logo
          width={isOpen ? 120 : 0}
          height={isOpen ? 120 : 0}
          className="self-center mt-20 text-white"
        />
        {/* {isOpen && <Logo className="self-center" />} */}
        <nav className="flex flex-col gap-2 ">
          {items.map((item, index) => {
            const Icon = Icons[item.icon || "arrowRight"];
            return (
              item.href && (
                <Link
                  key={index}
                  href={item.disabled ? "/" : item.href}
                >
                  <span
                    className={cn(
                      isOpen ? "px-4 " : " justify-center",
                      "group flex  items-center rounded-md  py-3 text-sm font-medium hover:bg-accent-600  text-background transition-all duration-200 ",
                      path === item.href
                        ? "bg-background text-foreground rounded-l-xl rounded-r-none hover:bg-backround hover:text-foreground"
                        : "transparent",
                      item.disabled &&
                        "cursor-not-allowed opacity-80"
                    )}
                  >
                    <Icon
                      className={cn(
                        isOpen ? "mr-2 h-4 w-4" : "h-5 w-5",
                        ""
                      )}
                    />
                    {isOpen ? (
                      <span className="truncate">
                        {item.title}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </Link>
              )
            );
          })}
        </nav>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 px-2 py-1  hover:bg-primary-600 rounded bg-transparent flex items-center align-center justify-center "
          >
            <Icons.arrowLeftRight className="h-3 w-3  text-background " />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </aside>
    </Collapsible>
  );
}
