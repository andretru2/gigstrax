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
import ClientForm from "@/components/clients/client-form";
import ClientTabs from "@/components/clients/client-tabs";
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
import { get } from "@/app/_actions/client";
import { Separator } from "@/components/ui/separator";
import GigDetailTabs from "@/components/gigs/gig-detail-tabs";
import { notFound } from "next/navigation";

// import NotFo

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Client",
  description: "Manage your client",
};

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const id = params.id;
  if (!id) return <h1>Please select a client. </h1>;

  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 400);

  const [client] = await Promise.all([get(id)]);

  if (!client) return notFound();

  const {
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    client: clientName,
    clientType,
    contact,
    email,
    phoneCell,
    phoneLandline,
    notes,
    source,
    status,
  } = client;

  const addressFull =
    addressStreet &&
    formatAddress({
      addressLine1: addressStreet,
      city: addressCity ?? "",
      state: addressState ?? "",
      zip: addressZip ?? "",
    });

  return (
    <Card className="border-0 bg-background [&>*]:px-0 ">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between space-x-2 ">
          <CardTitle className=" flex flex-col gap-2 text-xl font-medium">
            <>
              <div className="flex flex-row items-center gap-2">
                <Icons.user className="h-4 w-4 text-primary/60" />
                {!clientName ? (
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
        <ClientTabs id={id} />
        <ClientForm client={client} />
      </CardContent>
    </Card>
  );
}
