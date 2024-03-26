// "use client";
import { type Metadata } from "next";
import { env } from "@/env.mjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GigHeaderForm } from "@/components/gigs/gig-header-form";

import { getGigs } from "@/app/_actions/gig";
import { getClients } from "@/app/_actions/client";

import { BackButton } from "@/components/ui/back-button";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Gig",
  description: "Manage your gig",
};

interface Props {
  params: {
    gigId: string;
  };
}

export default function Page(props: Props) {
  return (
    <Card className="border-0 bg-background [&>*]:px-0 ">
      <CardContent className="flex flex-col gap-2">
        <BackButton />
        <Suspense fallback={<Spinner />}>
          <GigHeader {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function GigHeader(props: Props) {
  const { gigId } = props.params;

  if (!gigId) {
    return <h1>Please select a gig</h1>;
  }

  const res = await getGigs({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      price: true,
      amountPaid: true,
      clientId: true,
    },
    whereClause: {
      id: gigId,
    },
  });

  const gig = res.data[0];

  if (!gig) return <h1>Gig not found</h1>;

  let client;
  if (gig.clientId) {
    const resClient = await getClients({
      select: {
        id: true,
        client: true,
      },
      whereClause: {
        id: gig.clientId,
      },
    });

    client = resClient.data[0];
  }

  return (
    <Card className="grid  grid-cols-12 p-4 ">
      <CardHeader className="px-0">
        <CardTitle>Gig Details</CardTitle>
      </CardHeader>
      <CardContent className="  col-span-12 mt-3 gap-2 px-0">
        <GigHeaderForm
          id={gigId}
          gig={gig}
          client={client ? client : undefined}
        />
      </CardContent>
    </Card>
  );
}

// async function getClient(id: string) {
//   if (!id) return null;
//   const client = await getClient(id);
// }

// async function fetchSantas() {
//   return await getSantas();
// }

// async function fetchMrSantas() {
//   return await getMrsSantas();
// }
