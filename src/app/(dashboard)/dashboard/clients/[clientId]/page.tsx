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
import ClientDetailTabs from "@/components/clients/client-detail-tabs";
import {
  formatDate,
  formatTime,
  formatAddress,
  fromUTC,
  toUTC,
  calculateTimeDifference,
  formatPhone,
} from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { getClient } from "@/app/_actions/client";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import SectionHeaderInfo from "@/components/ui/section-header-info";

// import { useGigStore } from "@/app/_store/gig";

// import NotFo

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Client",
  description: "Manage your client",
};

interface Props {
  params: {
    clientId: string;
  };
}

export default async function Page({ params }: Props) {
  const id = params.clientId;
  if (!id) return <h1>Please select a client. </h1>;

  const [client] = await Promise.all([getClient(id)]);

  if (!client) return notFound();
  // const [setClient] = useGigStore()
  // useGigStore.setState({ client: client });

  // setClient({ ...client })

  const {
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    client: clientName,
    phoneCell,
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
        <Card className="flex items-start justify-between space-x-2 border-b-2 border-b-primary bg-card p-2 shadow-md ">
          <CardTitle className=" flex flex-col gap-10 text-xl font-medium">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-2">
                <SectionHeaderInfo
                  icon="user"
                  data={clientName ? clientName : "incomplete"}
                />
              </div>

              <div>
                <div className="flex flex-row items-center gap-2">
                  <SectionHeaderInfo
                    icon="phone"
                    data={phoneCell ? formatPhone(phoneCell) : "incomplete"}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <SectionHeaderInfo
                    icon="map"
                    data={addressFull ? addressFull : "incomplete"}
                  />
                </div>
              </div>
            </div>
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
        </Card>
        <CardDescription className=" mt-12">
          {/* <div className="border-4"> </div> */}
          {/* <Separator /> */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Separator className="mb-8 " />
        <ClientDetailTabs id={id} />
        <ClientForm {...client} />
      </CardContent>
    </Card>
  );
}
