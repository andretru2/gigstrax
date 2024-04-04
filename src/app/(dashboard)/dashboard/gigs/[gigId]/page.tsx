// "use client";
import { type Metadata } from "next";
import { env } from "@/env.mjs";
import { unstable_noStore as noStore } from "next/cache";
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
// import { ClientForm } from "@/components/clients/client-form";
import { type Client, type Gig, type Source } from "@prisma/client";

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

async function getClient(clientId: string) {
  if (!clientId) return null;
  const { data } = await getClients({
    select: {
      id: true,
      client: true,
      clientType: true,
      contact: true,
      phoneCell: true,
      email: true,
      addressCity: true,
      addressState: true,
      addressStreet: true,
      addressZip: true,
      phoneLandline: true,
      createdAt: true,
      status: true,
      updatedAt: true,
      createdBy: true,
      updatedBy: true,
      notes: true,
    },
    whereClause: {
      id: clientId,
    },
  });
  return data[0] as Client;
}

async function getGig(gigId: string) {
  const { data } = await getGigs({
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
      venueAddressCity: true,
      venueAddressName: true,
      venueAddressState: true,
      venueAddressStreet: true,
      venueAddressStreet2: true,
      venueAddressZip: true,
      contactEmail: true,
      contactName: true,
      contactPhoneCell: true,
      contactPhoneLand: true,
      notesVenue: true,
      venueType: true,
    },
    whereClause: {
      id: gigId,
    },
  });
  return data[0] as Gig;
}

async function getSource(id: string) {
  if (!id) return null;
  const { data } = await getSources({
    select: {
      id: true,
      nameFirst: true,
      nameLast: true,
      role: true,
    },
    whereClause: {
      id: id,
    },
  });
  return data[0] as Source;
}

export default async function Page(props: Props) {
  // const client = gig?.clientId && (await getClient(gig?.clientId));
  noStore();
  const { gigId } = props.params;

  if (!gigId) {
    return <h1>Please select a gig</h1>;
  }
  const gig = await getGig(gigId);

  if (!gig) return <h1>Gig not found</h1>;

  const client = gig?.clientId && (await getClient(gig?.clientId));
  const santa = gig?.santaId && (await getSource(gig?.santaId));
  const mrsSanta = gig?.mrsSantaId && (await getSource(gig?.mrsSantaId));

  const parsedSearchParams = searchParamsCache.parse(props.searchParams);

  return (
    <Card className="mx-auto w-full  border-0 bg-background [&>*]:px-0 ">
      <CardContent className="flex flex-col gap-2">
        <BackButton />
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
          // clientDetails={<ClientForm key="clientDetails" {...client} />}
        />
        {/* <Suspense fallback={<Spinner />}>
          <GigFormWrapper {...props} />
        </Suspense> */}
        {/* <Suspense fallback={<Spinner />}>
          <ClientForm />
        </Suspense> */}
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
  // const gig = await getGig(gigId);

  const resultGig = await getGigs({
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
      venueAddressCity: true,
      venueAddressName: true,
      venueAddressState: true,
      venueAddressStreet: true,
      venueAddressStreet2: true,
      venueAddressZip: true,
      contactEmail: true,
      contactName: true,
      contactPhoneCell: true,
      contactPhoneLand: true,
      notesVenue: true,
      venueType: true,
    },
    whereClause: {
      id: gigId,
    },
  });

  const gig = resultGig.data[0] as Gig;

  if (!gig) return <h1>Gig not found</h1>;

  const client = gig?.clientId && (await getClient(gig?.clientId));
  const santa = gig?.santaId && (await getSource(gig?.santaId));
  const mrsSanta = gig?.mrsSantaId && (await getSource(gig?.mrsSantaId));

  const parsedSearchParams = searchParamsCache.parse(props.searchParams);

  console.log("gig, client", gig, client.id, client.client);

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
      // clientDetails={<ClientForm key="clientDetails" {...client} />}
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
