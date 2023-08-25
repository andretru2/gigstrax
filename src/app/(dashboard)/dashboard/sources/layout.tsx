import SourceTabs from "@/components/sources/source-tabs";
import Header from "@/components/header";
import { type Metadata } from "next";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Sources",
  description: "Manage your sources",
};

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <>
      <Header heading="Sources" separator={true} />
      <SourceTabs />
      {children}
    </>
  );
}
