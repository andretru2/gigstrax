import DataTable from "@/components/gigs/data-table";
import { type GigTab } from "@/types/index";
import { redirect } from "next/navigation";
import type { GigProps } from "@/server/db";
import { type Prisma } from "@prisma/client";
import type { GetGigsProps } from "@/types/index";
import { PER_PAGE } from "@/lib/constants";

import { getGigs } from "@/app/_actions/gig";

interface Props {
  params: {
    tab: GigTab;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export const revalidate = 120;

export default async function Page({ params, searchParams }: Props) {
  const {
    page,
    per_page = PER_PAGE,
    sort,
    clientId,
    santaId,
    tab = "upcoming",
  } = searchParams ?? {};

  let { whereClause, select, limit, orderBy }: GetGigsProps = {};

  select = {
    id: true,
    gigDate: true,
    timeStart: true,
    timeEnd: true,
    venueAddressCity: true,
    venueAddressState: true,
    venueAddressName: true,
    venueAddressZip: true,
    venueAddressStreet: true,
    clientId: true,
    mrsSantaId: true,
    santaId: true,
    // createdAt: true,

    client: {
      select: {
        client: true,
      },
    },
    santa: {
      select: {
        role: true,
        // fullName: true,
      },
    },
    mrsSanta: {
      select: {
        nameFirst: true,
      },
    },
  };

  whereClause = {
    createdAt: { not: null },
  };

  switch (tab) {
    /** TODO: add to search params instead */
    case "recentlyCreated":
      // orderBy = [{ createdAt: "desc" }];
      orderBy = [{ updatedAt: { sort: "desc", nulls: "last" } }];

      break;

    case "upcoming":
      whereClause = { ...whereClause, gigDate: { gte: new Date() } };
      orderBy = [{ gigDate: "asc" }];
      break;

    case "past":
      whereClause = { ...whereClause, gigDate: { lte: new Date() } };
      orderBy = [{ gigDate: "desc" }];
      break;

    case "all":
      orderBy = [];
      break;
  }

  // Number of items per page
  limit = typeof per_page === "string" ? parseInt(per_page) : PER_PAGE;

  const skip = typeof page === "string" ? (parseInt(page) - 1) * limit : 0;

  // Column and order to sort by specified
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof GigProps | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  if (column && order) {
    switch (column) {
      /** TODO: add to search params instead */
      case "clientId":
        orderBy = [
          {
            client: {
              client: order,
            },
          },
        ];
        break;

      case "santaId":
        orderBy = [
          {
            santa: {
              role: order,
            },
          },
        ];
        break;

      case "mrsSantaId":
        orderBy = [
          {
            mrsSanta: {
              nameFirst: order,
            },
          },
        ];
        break;

      default:
        orderBy =
          orderBy && orderBy.length > 0
            ? [...orderBy, { [column]: order }]
            : [{ [column]: order }];
        break;
    }
  }

  if (clientId) {
    whereClause.client = {
      client: {
        contains: clientId as string,
        mode: "insensitive",
      },
    };
  }

  if (santaId) {
    whereClause.santa = {
      role: {
        contains: santaId as string,
        mode: "insensitive",
      },
    };
  }

  const { data, totalCount } = await getGigs({
    whereClause,
    select,
    limit,
    orderBy,
    skip,
  });

  const pageCount = Math.ceil(totalCount / limit);

  return <DataTable data={data} pageCount={pageCount} />;
}
