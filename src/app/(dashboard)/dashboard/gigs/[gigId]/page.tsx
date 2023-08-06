import { type Metadata } from "next";
import { prisma, type GigProps } from "@/server/db";
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
  const data = (await prisma.gig.findFirst({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      venueAddressCity: true,
      venueAddressName: true,
      venueAddressState: true,
      venueAddressStreet: true,
      venueAddressStreet2: true,
      venueAddressZip: true,
      client: {
        select: {
          client: true,
        },
      },
    },
    where: {
      id: gigId,
    },
  })) satisfies GigProps;

  // const { gigDate, timeStart, timeEnd } = data;

  const formattedDate = data?.gigDate && formatDate(data?.gigDate, "friendly");
  const startTime = data?.timeStart && formatTime(data?.timeStart);
  const endTime = data?.timeEnd && formatTime(data?.timeEnd);
  const client = data?.client.client && data?.client.client;
  const addressFull =
    data?.venueAddressName &&
    formatAddress({
      name: data?.venueAddressName,
      addressLine1: data?.venueAddressStreet,
      addressLine2: data?.venueAddressStreet2 ?? "",
      city: data?.venueAddressCity,
      state: data?.venueAddressState,
      zip: data?.venueAddressZip ?? "",
    });

  const durationHours =
    data?.timeStart && data?.timeEnd
      ? duration(data.timeStart, data.timeEnd)
      : null;

  return (
    <Card className="border-2">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <CardTitle className=" flex flex-col gap-2 text-xl">
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
            <Button>Copy</Button>
            <Button>PDF</Button>
            <Button>Invoice</Button>
          </div>
        </div>
        <CardDescription className=" flex flex-col gap-2 text-2xl font-bold text-foreground">
          {/* <span>{client}</span> <span>{addressFull}</span> */}
        </CardDescription>
      </CardHeader>
      {/* <CardContent>{data && <GigForm {...data} />}</CardContent> */}
    </Card>
  );
}
