// "use client";
import { type Metadata } from "next";
// import { prisma, type GigProps } from "@/server/db";
import { env } from "@/env.mjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GigForm from "@/components/gigs/gig-form";
import {
  formatDate,
  formatTime,
  formatAddress,
  fromUTC,
  toUTC,
  calculateTimeDifference,
} from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getGig } from "@/app/_actions/gig";
import { Separator } from "@/components/ui/separator";
import GigDetailTabs from "@/components/gigs/gig-detail-tabs";
import { getSantas, getMrsSantas } from "@/app/_actions/source";
import { getClient, getClients } from "@/app/_actions/client";
import { notFound } from "next/navigation";
import { useGigStore } from "@/app/_store/gig";
import ClientForm from "@/components/clients/client-form";
import StoreInitializer from "@/components/gigs/store-initializer";
import { type ClientProps } from "@/server/db";
import { useEffect } from "react";

// import NotFo

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Gig",
  description: "Manage your gig",
};

// export const revalidate = 30;
export const dynamic = "force-dynamic";
// export const dynamic = true;
export const cache = "no-store";

interface Props {
  params: {
    gigId: string;
  };
}

export default async function Page({ params }: Props) {
  const gigId = params.gigId;
  if (!gigId) return <h1>Please select a gig. </h1>;

  const gig = await getGig(gigId);
  if (!gig) return notFound();

  // const today = new Date();
  // const fiveDaysAgo = new Date();
  // fiveDaysAgo.setDate(today.getDate() - 400);

  const [client, santas, mrsSantas] = await Promise.all([
    // getGig(gigId),
    gig.clientId ? getClient(gig.clientId) : undefined,
    getSantas(),
    getMrsSantas(),
  ]);

  client && useGigStore.setState({ client });

  console.log(client);

  const formattedDate =
    gig?.gigDate && formatDate(gig?.gigDate.getTime(), "friendly");
  const startTime = gig.timeStart && formatTime(gig?.timeStart);
  // const startTime = gig.timeStart && formatTime(gig.get("")timeStart);
  const endTime = gig?.timeEnd && formatTime(gig?.timeEnd);
  const clientName = client?.client ?? "";
  const addressFull =
    gig?.venueAddressName &&
    formatAddress({
      name: gig?.venueAddressName,
      addressLine1: gig?.venueAddressStreet ?? "",
      addressLine2: gig?.venueAddressStreet2 ?? "",
      city: gig?.venueAddressCity ?? "",
      state: gig?.venueAddressState ?? "",
      zip: gig?.venueAddressZip ?? "",
    });

  const durationHours =
    gig?.timeStart && gig?.timeEnd
      ? calculateTimeDifference(gig.timeStart, gig.timeEnd)
      : null;

  return (
    <Card className="border-0 bg-background [&>*]:px-0 ">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between space-x-2 ">
          <CardTitle className=" flex flex-col gap-2 text-xl font-medium">
            <>
              {/* <h1>Create New Gig</h1> */}
              <div className="flex flex-row items-center gap-2">
                <Icons.calendar className="h-4 w-4 text-primary/60" />
                {!formattedDate ? (
                  <div className="italic text-destructive/60">incomplete </div>
                ) : (
                  <div>{formattedDate}</div>
                )}
              </div>
            </>
            <>
              <div className="flex flex-row items-center gap-2">
                <Icons.clock className="h-4 w-4 text-primary/60" />
                {!startTime || !endTime ? (
                  <div className="italic text-destructive/60">incomplete </div>
                ) : (
                  <div>
                    {startTime} - {endTime}{" "}
                    {durationHours && ` (${durationHours} hours)`}
                  </div>
                )}
              </div>
            </>
            <>
              <div className="flex flex-row items-center gap-2">
                <Icons.user className="h-4 w-4 text-primary/60" />
                {!client ? (
                  <div className="italic text-destructive/60">incomplete </div>
                ) : (
                  <div>{clientName}</div>
                )}
              </div>
            </>
            <>
              <div className="flex flex-row items-center gap-2">
                <Icons.map className="h-4 w-4 text-primary/60" />
                {!addressFull ? (
                  <div className="italic text-destructive/60">incomplete </div>
                ) : (
                  <div>{addressFull}</div>
                )}
              </div>
            </>
          </CardTitle>
          {/* <div className="flex flex-row gap-2">
            <Button
              variant="secondary"
              className="flex flex-row items-center gap-1"
            >
              <Icons.copy className="h-4 w-4" />
              Copy
            </Button>

            <Button
              variant="secondary"
              className="flex flex-row items-center gap-1"
            >
              <Icons.report className="h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="secondary"
              className="flex flex-row items-center gap-1"
            >
              <Icons.billing className="h-4 w-4" />
              Invoice
            </Button>
          </div> */}
        </div>
        <CardDescription className=" mt-12">
          {/* <div className="border-4"> </div> */}
          {/* <Separator /> */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Separator className="mb-8 " />
        {/* {client ? <StoreInitializer client={client} /> : null} */}

        <GigDetailTabs gigId={gig.id} />
        <GigForm
          gig={gig}
          santas={santas}
          mrsSantas={mrsSantas}
          // clients={clients.data}
          // clientSuggestions={clientSuggestions.data}
        >
          {client && (
            <>
              <StoreInitializer client={client} />
              <ClientForm {...client} />
            </>
          )}
        </GigForm>
      </CardContent>
    </Card>
  );
}
