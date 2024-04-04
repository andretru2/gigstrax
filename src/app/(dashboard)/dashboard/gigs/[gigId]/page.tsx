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
import { GigForm } from "@/components/gigs/gig-form";

import { getGigs } from "@/app/_actions/gig";
import { getClients } from "@/app/_actions/client";

import { BackButton } from "@/components/ui/back-button";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { ClientPicker } from "@/components/clients/client-picker";
import { type SearchParams } from "nuqs/server";
import { searchParamsCache } from "@/components/search-params";
import { SourcePicker } from "@/components/sources/source-picker";
import { getSources } from "@/app/_actions/source";

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

async function getClient(props: Props) {
  const { data } = await getClients({
    select: {
      id: true,
      client: true,
    },
    whereClause: {
      id: props.params.gigId,
    },
  });

  return data[0];
}

export default function Page(props: Props) {
  return (
    <Card className="mx-auto w-full  border-0 bg-background [&>*]:px-0 ">
      <CardContent className="flex flex-col gap-2">
        <BackButton />
        <Suspense fallback={<Spinner />}>
          <GigFormWrapper {...props} />
        </Suspense>

        {/* <Suspense fallback={<Spinner />}>{props.clientPicker}</Suspense> */}
        {/* <ClientPicker
          searchParams={searchParamsCache.parse(props.searchParams)}
          gigId={props.params.gigId}
        /> */}
      </CardContent>
    </Card>
  );
}

async function GigFormWrapper(props: Props) {
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
      santaId: true,
      mrsSantaId: true,
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

  let santa;
  if (gig.santaId) {
    const resSanta = await getSources({
      select: {
        id: true,
        role: true,
        nameFirst: true,
        nameLast: true,
      },
      whereClause: {
        id: gig.santaId,
      },
    });

    santa = resSanta.data[0];
  }

  let mrsSanta;
  if (gig.mrsSantaId) {
    const resMrsSanta = await getSources({
      select: {
        id: true,
        role: true,
        nameFirst: true,
        nameLast: true,
      },
      whereClause: {
        id: gig.mrsSantaId,
      },
    });

    mrsSanta = resMrsSanta.data[0];
  }

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
    />
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
