// "use client";
import DataTable from "@/components/gigs/data-table";
import Header from "@/components/header";
// import { useState } from "react";
import { type StatusTabs } from "@/types/index";
import { type Metadata } from "next";
import { prisma } from "@/server/db";
import { redirect } from "next/navigation";
import GigTabs from "@/components/gigs/gig-tabs";

export const metadata: Metadata = {
  title: "Gigs",
  description: "Manage your gigs",
};

interface Props {
  params: {
    status: StatusTabs;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

// type Status = "Upcoming" | "RecentylCreated" | "All"  | "CreateNew"

const STATUS_DEFAULT = "Upcoming";

async function getGigs(status: StatusTabs) {
  if (status === "Upcoming") {
    // const today = new Date();
    const today = new Date(2022, 12, 31);
    const data = await prisma.gig.findMany({
      where: {
        gigDate: { gte: today },
      },
      take: 10,
    });
    return data;
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { status = STATUS_DEFAULT } = searchParams;

  //entering the following on the url works:
  //http://localhost:3002/dashboard/gigs?status=CreateNew

  if (status === "CreateNew") return redirect("/dashboard/gigs/new");

  const data = await getGigs(status);

  console.log(data);

  return (
    <>
      <Header heading="Gigs" separator={true} />
      <GigTabs />
      <DataTable data={data} pageCount={10} />
    </>
  );
}
