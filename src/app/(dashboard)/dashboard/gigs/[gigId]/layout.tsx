import { type Metadata } from "next";

interface DashboardLayoutProps {
  children: React.ReactNode;
  // client: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Gig",
  description: "Manage your gig",
};

export default function Layout({ children }: DashboardLayoutProps) {
  return (
    <>
      {/* <Header heading="Gigs" separator={true} /> */}
      {children}
    </>
  );
}
