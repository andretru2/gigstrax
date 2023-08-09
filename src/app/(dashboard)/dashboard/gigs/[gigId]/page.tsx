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
  const data = gigId && (await getGig(gigId));

  if (!data) return <h1>Please select a gig. </h1>;

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
    <Card className="border-0 [&>*]:px-0 ">
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
      <CardContent className="">
        <Separator className="mb-8 " />
        <GigForm {...data} />
      </CardContent>
    </Card>
  );
}
