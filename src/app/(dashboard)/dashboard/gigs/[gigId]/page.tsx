// "use client";
import { type Metadata } from "next";
import { env } from "@/env.mjs";
import { Card, CardContent } from "@/components/ui/card";
import { GigForm } from "@/components/gigs/gig-form";

import { getGig } from "@/app/_actions/gig";
import { getClient } from "@/app/_actions/client";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { ClientPicker } from "@/components/clients/client-picker";
import { type SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/components/search-params";
import { SourcePicker } from "@/components/sources/source-picker";
import { getSource } from "@/app/_actions/source";
import { ClientForm } from "@/components/clients/client-form";

// export const revalidate = 30;
export const revalidate = 0;
// export const dynamic = "force-dynamic";
// export const cache = "no-store";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Gig",
  description: "Manage your gig",
};

interface Props {
  params: {
    gigId: string;
  };
  searchParams: SearchParams;
}

export default function Page(props: Props) {
  return (
    <Card className="mx-auto w-full  border-0 bg-background [&>*]:px-0 ">
      <CardContent className="flex flex-col gap-2">
        <Suspense fallback={<Spinner />}>
          <GigFormWrapper {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function GigFormWrapper(props: Props) {
  // noStore();
  const { gigId } = props.params;

  if (!gigId) {
    return <h1>Please select a gig</h1>;
  }
  const gig = await getGig(gigId);

  const client = gig?.clientId && (await getClient(gig?.clientId));
  const santa = gig?.santaId && (await getSource(gig?.santaId));
  const mrsSanta = gig?.mrsSantaId && (await getSource(gig?.mrsSantaId));

  const parsedSearchParams = searchParamsCache.parse(props.searchParams);

  return (
    <GigForm
      id={gigId}
      gig={gig}
      client={client ? client : undefined}
      santa={santa ? santa : undefined}
      mrsSanta={mrsSanta ? mrsSanta : undefined}
      clientPicker={
        <ClientPicker
          key="clientPicker"
          searchParams={parsedSearchParams}
          gigId={props.params.gigId}
        />
      }
      santaPicker={
        <SourcePicker
          key="santaPicker"
          searchParams={parsedSearchParams}
          gigId={props.params.gigId}
          role="RBS"
        />
      }
      mrsSantaPicker={
        <SourcePicker
          key="mrsSantaPicker"
          searchParams={parsedSearchParams}
          gigId={props.params.gigId}
          role="Mrs. Claus"
        />
      }
      clientDetails={<ClientForm key="clientDetails" {...client} />}
    />
  );
}
