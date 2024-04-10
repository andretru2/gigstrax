import { type Metadata } from "next";
import { GigDetailTabs } from "@/components/gigs/gig-detail-tabs";
import { BackButton } from "@/components/ui/back-button";

interface DashboardLayoutProps {
  params: {
    gigId: string;
  };
  children: React.ReactNode;
  // client: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Gig",
  description: "Manage your gig",
};

export default function Layout({ params, children }: DashboardLayoutProps) {
  return (
    <>
      {/* <Header heading="Gigs" separator={true} /> */}
      <BackButton />
      <GigDetailTabs gigId={params.gigId} />
      {children}
    </>
  );
}
