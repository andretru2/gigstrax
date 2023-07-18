import { redirect } from "next/navigation";
// import { currentUser } from "@clerk/nextjs";

import { dashboardConfig } from "@/config/dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarNav from "@/components/layout/sidebar-nav";
// import { SiteFooter } from "@/components/layouts/site-footer";
// import { SiteHeader } from "@/components/layouts/site-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // const user = await currentUser();

  // if (!user) {
  //   redirect("/signin");
  // }
  return (
    <div className="grid flex-1  md:flex  w-screen   h-screen ">
      <SidebarNav items={dashboardConfig.sidebarNav} />
      <ScrollArea className="w-full">
        <main className="flex flex-col  flex-1 gap-12  container  overflow-y-scroll w-screen h-full pt-12 pb-24  ">
          {children}
        </main>
      </ScrollArea>
    </div>
  );

  
}
