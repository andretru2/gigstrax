import GigTabs from "@/components/gigs/gig-tabs";
import Header from "@/components/header";
import { type Metadata } from "next";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Gigs",
  description: "Manage your gigs",
};

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <>
      {/* <Header heading="Gigs" separator={true} /> */}
      {children}
    </>
  );
}
