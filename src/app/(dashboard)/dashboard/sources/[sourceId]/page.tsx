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
import SourceForm from "@/components/sources/source-form";
import SourceDetailTabs from "@/components/sources/source-detail-tabs";
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
import { getSource } from "@/app/_actions/source";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import SectionHeaderInfo from "@/components/ui/section-header-info";

// import NotFo

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Source",
  description: "Manage your source",
};

interface Props {
  params: {
    sourceId: string;
  };
}

export default async function Page({ params }: Props) {
  const id = params.sourceId;
  if (!id) return <h1>Please select a source. </h1>;

  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 400);

  const [source] = await Promise.all([getSource(id)]);

  if (!source) return notFound();

  const {
    addressCity,
    addressState,
    addressStreet,
    addressZip,
    nameFirst,
    nameLast,
    phone,
    email,
  } = source;

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
        <Card className="flex items-start justify-between space-x-2 border-b-2 border-b-primary bg-card p-2 shadow-md">
          <CardTitle className="flex flex-row gap-10 text-xl font-medium">
            <div className="flex flex-col gap-2">
              <SectionHeaderInfo
                icon="user"
                data={
                  nameFirst && nameLast
                    ? `${nameFirst} ${nameLast}`
                    : "incomplete"
                }
              />
              <SectionHeaderInfo
                icon="phone"
                data={phone ? formatPhone(phone) : "incomplete"}
              />
            </div>
            <div className="flex flex-col gap-2">
              <SectionHeaderInfo icon="email" data={email || "incomplete"} />
              <SectionHeaderInfo
                icon="map"
                data={addressFull || "incomplete"}
              />
            </div>
          </CardTitle>
          {/* Additional buttons go here */}
        </Card>
        <CardDescription className=" mt-12">
          {/* <div className="border-4"> </div> */}
          {/* <Separator /> */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* <Separator className="mb-8 " /> */}
        <SourceDetailTabs id={id} />
        <SourceForm {...source} />
      </CardContent>
    </Card>
  );
}
