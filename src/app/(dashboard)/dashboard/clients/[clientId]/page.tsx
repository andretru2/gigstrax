import { type Metadata } from "next";
// import { prisma, type GigProps } from "@/server/db";
import { env } from "@/env.mjs";
import { Card, CardContent } from "@/components/ui/card";
import { ClientForm } from "@/components/clients/client-form";
import { ClientDetailTabs } from "@/components/clients/client-detail-tabs";
import { getClient } from "@/app/_actions/client";
import { BackButton } from "@/components/ui/back-button";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Client",
  description: "Manage your client",
};

export const revalidate = 0;

interface Props {
  params: {
    clientId: string;
  };
}

export default function Page(props: Props) {
  return (
    <Card className="animate-fadeIn mx-auto w-full  border-0 bg-background [&>*]:px-0 ">
      <CardContent className="flex flex-col gap-2">
        <BackButton />
        <ClientDetailTabs id={props.params.clientId} />
        <Suspense fallback={<Spinner />}>
          <ClientFormWrapper {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function ClientFormWrapper(props: Props) {
  const client = await getClient(props.params.clientId);
  return <ClientForm {...client} />;
}
