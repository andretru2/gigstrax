import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiEventCreateForm } from "@/components/gigs/mulit-event-create-form";
import { getGig, getGigs } from "@/app/_actions/gig";
import { formatDate, getTimeFromDate } from "@/lib/utils";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Icons } from "@/components/icons";

interface Props {
  params: {
    gigId: string;
  };
}

export default function Page(props: Props) {
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

  const { data: thisYear } = await getGigs({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      venueAddressName: true,
      santa: {
        select: {
          id: true,
          role: true,
        },
      },
      client: {
        select: {
          client: true,
        },
      },
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

  const { data: prevYears } = await getGigs({
    select: {
      id: true,
      gigDate: true,
      timeStart: true,
      timeEnd: true,
      venueAddressName: true,
      santa: {
        select: {
          id: true,
          role: true,
        },
      },
      client: {
        select: {
          client: true,
        },
      },
    },
    whereClause: {
      clientId: {
        equals: gig?.clientId,
      },
      gigDate: {
        lte: startOfYear,
      },
    },
    orderBy: [{ gigDate: "desc" }],
  });

  return (
    <Card className="h-full w-full p-4">
      <CardHeader>
        <CardTitle>Gigs for Client</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex max-w-4xl  flex-col divide-y ">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className=" font-semibold">This year</h3>
            {thisYear.map((gig) => (
              <Link
                key={gig.id}
                className="flex flex-row gap-3 bg-white p-2"
                href={`/dashboard/gigs/${gig.id}`}
              >
                <Icons.arrowRight className="size-4" />
                <span className="w-32">{gig.client.client}</span>
                <span className="w-40">
                  {formatDate(gig?.gigDate, "friendly")}
                </span>
                <span className="w-12">{getTimeFromDate(gig?.timeStart)}</span>
                <span className="w-12">{getTimeFromDate(gig?.timeEnd)}</span>
                <span className="w-20">{gig.santa?.role}</span>
                <span className="">{gig.venueAddressName}</span>
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">Prev years</h3>
            {prevYears.map((gig) => (
              <Link
                key={gig.id}
                className="flex flex-row gap-3 bg-white p-2 "
                href={`/dashboard/gigs/${gig.id}`}
              >
                <Icons.arrowRight className="size-4" />
                <span className="w-32">{gig?.client?.client}</span>
                <span className="w-40">
                  {formatDate(gig?.gigDate, "friendly")}
                </span>
                <span className="w-12">{getTimeFromDate(gig?.timeStart)}</span>
                <span className="w-12">{getTimeFromDate(gig?.timeEnd)}</span>
                <span className="w-20">{gig?.santa?.role}</span>
                <span className="">{gig.venueAddressName}</span>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
