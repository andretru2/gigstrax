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
      {/* <Header heading="Clients" separator={true} /> */}
      {/* <ClientTabs /> */}
      {children}
    </>
  );
}
