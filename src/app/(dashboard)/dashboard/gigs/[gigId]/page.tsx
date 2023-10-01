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
import { getGig, getGigs } from "@/app/_actions/gig";
import { Separator } from "@/components/ui/separator";
import GigDetailTabs from "@/components/gigs/gig-detail-tabs";
import { getSantas, getMrsSantas } from "@/app/_actions/source";
import { getClient } from "@/app/_actions/client";
import { notFound } from "next/navigation";
import { useGigStore } from "@/app/_store/gig";
import ClientForm from "@/components/clients/client-form";
import StoreInitializer from "@/components/gigs/store-initializer";
import SectionHeaderInfo from "@/components/ui/section-header-info";
import MultiEventCreate from "@/components/gigs/mulit-event";
import { type GetGigsProps } from "@/types/index";
// import dynamic from "next/dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Gig",
  description: "Manage your gig",
};

// export const revalidate = 30;
export const dynamic = "force-dynamic";
// export const dynamic = true;
export const cache = "no-store";

// const MultiEvent = await import("@/components/gigs/multi-event");

// const MultiEvent = dynamic(() => import("@/components/gigs/multi-event"));

interface Props {
  params: {
    gigId: string;
  };
}

export default async function Page({ params }: Props) {
  const gigId = params.gigId;
  if (!gigId) return <h1>Please select a gig. </h1>;

  const { data } = await getGigs({
    whereClause: { id: gigId },
    select: { clientId: true, timeStart: true, timeEnd: true, gigDate: true },
  });

  console.log(data);
  if (!data) return notFound();

  console.log(data);

  // const { clientId, timeStart, timeEnd, gigDate } = data;
  const gig = data[0];

  if (!gig) return;

  console.log(
    gig.clientId,
    // formatTime(gig?.timeStart),
    gig.timeEnd,
    gig.gigDate
  );

  const [client, santas, mrsSantas] = await Promise.all([
    gig.clientId ? getClient(gig.clientId) : undefined,
    getSantas(),
    getMrsSantas(),
  ]);

  client && useGigStore.setState({ client });

  const formattedDate = gig.gigDate && formatDate(gig.gigDate, "friendly");

  // const startTime = timeStart && timeStart.toLocaleTimeString("en-US");
  // const endTime = gig?.timeEnd && formatTime(gig?.timeEnd);

  const clientName = client?.client ?? "";
  // const addressFull =
  //   gig?.venueAddressName &&
  //   formatAddress({
  //     name: gig?.venueAddressName,
  //     addressLine1: gig?.venueAddressStreet ?? "",
  //     addressLine2: gig?.venueAddressStreet2 ?? "",
  //     city: gig?.venueAddressCity ?? "",
  //     state: gig?.venueAddressState ?? "",
  //     zip: gig?.venueAddressZip ?? "",
  //   });

  const durationHours =
    gig.timeStart && gig.timeEnd
      ? calculateTimeDifference(gig.timeStart, gig.timeEnd)
      : null;

  let timeFormat;
  if (gig.timeStart && gig.timeEnd) {
    timeFormat = `${formatTime(
      fromUTC(gig.timeStart)
    )} - ${gig.timeEnd.toLocaleTimeString("en-us")}`;
    if (durationHours) {
      timeFormat += ` (${durationHours} hours)`;
    }
  } else {
    timeFormat = "incomplete";
  }

  return (
    <Card className="border-0 bg-background [&>*]:px-0 ">
      <CardHeader className="space-y-1">
        <Card className="flex  flex-col  border-b-2   border-b-primary p-4 shadow-md ">
          <CardHeader className="px-0">
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-12 px-0 text-lg font-bold">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2 ">
                <SectionHeaderInfo
                  icon="calendar"
                  data={formattedDate ? formattedDate : "incomplete"}
                />
              </div>

              <div className="flex flex-row items-center gap-2">
                <SectionHeaderInfo icon="clock" data={timeFormat} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <SectionHeaderInfo
                  icon="user"
                  data={client ? clientName : "incomplete"}
                />
              </div>

              <div className="flex flex-row items-center gap-2">
                {/* <SectionHeaderInfo
                  icon="map"
                  data={addressFull ? addressFull : "incomplete"}
                /> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* <Separator className="mb-4 " /> */}
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
        <MultiEventCreate {...gig} />
      </CardContent>
    </Card>
  );
}
