import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiEventCreateForm } from "@/components/gigs/mulit-event-create-form";
import { getGig, getGigs } from "@/app/_actions/gig";
import { formatDate, getTimeFromDate } from "@/lib/utils";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: {
    gigId: string;
  };
}

export default function Page(props: Props) {
  console.log(props);
  return (
    <Card className="h-full w-full p-4">
      <CardContent className="flex flex-col gap-4">
        <MultiEventCreateForm copiedFromId={props.params.gigId} />
        <Suspense fallback={<Spinner />}>
          <GigList {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function GigList(props: Props) {
  const gig = await getGig(props.params.gigId);

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);

  const { data } = await getGigs({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
    },
    whereClause: {
      clientId: {
        equals: gig?.clientId,
      },
      gigDate: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    orderBy: [{ gigDate: "asc" }],
  });

  return (
    <Card className="h-full w-full p-4">
      <CardHeader>
        <CardTitle>Gigs for Client</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4">
        {data.map((gig) => (
          <div key={gig.id} className="flex flex-row gap-3">
            <span>{formatDate(gig?.gigDate, "friendly")}</span>
            <span>{getTimeFromDate(gig?.timeStart)}</span>
            <span>{getTimeFromDate(gig?.timeEnd)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
