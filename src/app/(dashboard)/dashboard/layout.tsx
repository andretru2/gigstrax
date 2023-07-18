import { redirect } from "next/navigation";
// import { currentUser } from "@clerk/nextjs";

import { dashboardConfig } from "@/config/dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarNav from "@/components/layouts/sidebar-nav";
import { type Metadata } from "next";
import { siteConfig } from "@/config/site";
// import { SiteFooter } from "@/components/layouts/site-footer";
import { SiteHeader } from "@/components/layouts/site-header";

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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // const user = await currentUser();

  // if (!user) {
  //   redirect("/signin");
  // }
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="grid h-screen  w-screen  flex-1   md:flex ">
        <SidebarNav items={dashboardConfig.sidebarNav} />
        <ScrollArea className="w-full">
          <main className="container flex  h-full w-screen  flex-1  flex-col gap-12 overflow-y-scroll pb-24 pt-12  ">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
