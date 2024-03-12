// "use client";
import { type Metadata } from "next";
import { env } from "@/env.mjs";
import { Card, CardContent } from "@/components/ui/card";
import { GigForm } from "@/components/gigs/gig-form";

import { getGigs } from "@/app/_actions/gig";

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
        <Suspense fallback={<Spinner />}>
          <Gig {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function Gig(props: Props) {
  const { gigId } = props.params;

  if (!gigId) {
    return <h1>Please select a gig</h1>;
  }

  const gig = await getGigs({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      venueAddressCity: true,
      venueAddressState: true,
      venueAddressName: true,
      venueAddressZip: true,
      venueAddressStreet: true,
      clientId: true,
      mrsSantaId: true,
      santaId: true,
    },
    whereClause: {
      id: gigId,
    },
  });

  return <GigForm gig={gig.data[0]} />;
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
