import { redirect } from "next/navigation";

// import { dashboardConfig } from "@/config/site";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Metadata } from "next";
import { siteConfig } from "@/config/site";
// import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";

import { auth } from "auth";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: "Andres Trujillo",
      url: "https://andres.trujillo.xyz",
    },
    { name: "Iuliia Bakhtoiarova", url: "https://iuliiadesign.com" },
    {
      name: "Joe Harkins",
      url: "https://realbeardsantas.com/oursantas/real-beard-santa-joe/",
    },
  ],
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();
  // if (!session || !session.user) {
  //   console.log("x");
  //   redirect("/signin");
  // }

  return (
    <div className="mx-auto flex min-h-svh max-w-screen-2xl  flex-col gap-8 ">
      <SiteHeader user={session?.user} />
      {/* <SidebarNav items={dashboardConfig.sidebarNav} /> */}
      <ScrollArea className="">
        <main className="flex w-full  flex-col gap-2 overflow-hidden text-foreground">
          {children}
        </main>
      </ScrollArea>
    </div>
  );
}
