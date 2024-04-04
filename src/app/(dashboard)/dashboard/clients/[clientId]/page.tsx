import { type Metadata } from "next";
// import { prisma, type GigProps } from "@/server/db";
import { env } from "@/env.mjs";
import { Card, CardContent } from "@/components/ui/card";
import { ClientForm } from "@/components/clients/client-form";
import ClientDetailTabs from "@/components/clients/client-detail-tabs";

import { getClients } from "@/app/_actions/client";
import { BackButton } from "@/components/ui/back-button";
import { type Client } from "@prisma/client";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

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

export default function Page(props: Props) {
  return (
    <Card className="mx-auto w-full  border-0 bg-background [&>*]:px-0 ">
      <CardContent className="flex flex-col gap-2">
        <BackButton />
        <Suspense fallback={<Spinner />}>
          <ClientFormWrapper {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function ClientFormWrapper(props: Props) {
  const { clientId } = props.params;

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

  const client = data[0] as Client;

  return <ClientForm {...client} />;
}
