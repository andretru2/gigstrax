import { type Metadata } from "next";
// import { prisma, type GigProps } from "@/server/db";
import { env } from "@/env.mjs";
import { Card, CardContent } from "@/components/ui/card";
import { SourceForm } from "@/components/sources/source-form";
// import ClientDetailTabs from "@/components/clients/client-detail-tabs";

import { getSource } from "@/app/_actions/source";
import { BackButton } from "@/components/ui/back-button";
import { type Source } from "@prisma/client";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";

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

export default function Page(props: Props) {
  return (
    <Card className="mx-auto w-full  border-0 bg-background [&>*]:px-0 ">
      <CardContent className="flex flex-col gap-2">
        <BackButton />
        <Suspense fallback={<Spinner />}>
          <SourceFormWrapper {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function SourceFormWrapper(props: Props) {
  const source = await getSource(props.params.sourceId);
  return <SourceForm {...source} />;
}
