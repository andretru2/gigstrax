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
import { formatDate, formatTime, duration, formatAddress } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getGig } from "@/app/_actions/gig";
import { Separator } from "@/components/ui/separator";
import GigDetailTabs from "@/components/gigs/gig-detail-tabs";
import { getSantas, getMrsSantas } from "@/app/_actions/source";
import { getClients } from "@/app/_actions/client";
import { notFound } from "next/navigation";

// import NotFo

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

export default async function Page({ params }: Props) {
  const gigId = params.gigId;
  if (!gigId) return <h1>Please select a gig. </h1>;

  const [gig, santas, mrsSantas, clients] = await Promise.all([
    getGig(gigId),
    getSantas(),
    getMrsSantas(),
    getClients(),
  ]);

  if (!gig) return notFound();

  const formattedDate = gig?.gigDate && formatDate(gig?.gigDate, "friendly");
  const startTime = gig?.timeStart && formatTime(gig?.timeStart);
  const endTime = gig?.timeEnd && formatTime(gig?.timeEnd);
  const client = gig?.client.client && gig?.client.client;
  const addressFull =
    gig?.venueAddressName &&
    formatAddress({
      name: gig?.venueAddressName,
      addressLine1: gig?.venueAddressStreet,
      addressLine2: gig?.venueAddressStreet2 ?? "",
      city: gig?.venueAddressCity,
      state: gig?.venueAddressState,
      zip: gig?.venueAddressZip ?? "",
    });

  const durationHours =
    gig?.timeStart && gig?.timeEnd
      ? duration(gig.timeStart, gig.timeEnd)
      : null;

  return (
    <Card className="border-0 bg-background [&>*]:px-0 ">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between space-x-2 ">
          <CardTitle className=" flex flex-col gap-2 text-xl font-medium">
            <>
              <div className="flex flex-row items-center gap-2">
                <Icons.calendar className="h-4 w-4 text-primary/60" />
                <div>
                  {formattedDate} | {startTime} - {endTime}{" "}
                  {durationHours && ` (${durationHours} hours)`}
                </div>
              </div>
            </>
            <>
              <div className="flex flex-row items-center gap-2">
                <Icons.user className="h-4 w-4 text-primary/60" />
                <div>{client}</div>
              </div>
            </>
            <>
              <div className="flex flex-row items-center gap-2">
                <Icons.map className="h-4 w-4 text-primary/60" />
                <div>{addressFull}</div>
              </div>
            </>
          </CardTitle>
          <div className="flex flex-row gap-2">
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
          </div>
        </div>
        <CardDescription className=" mt-12">
          {/* <div className="border-4"> </div> */}
          {/* <Separator /> */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Separator className="mb-8 " />
        <GigDetailTabs gigId={gig.id} />
        <GigForm
          gig={gig}
          santas={santas}
          mrsSantas={mrsSantas}
          clients={clients}
        />
      </CardContent>
    </Card>
  );
}
