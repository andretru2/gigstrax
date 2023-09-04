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
    name,
    category,
    tab = "upcoming",
  } = searchParams ?? {};

  console.log("params, searchParams", params, searchParams);

  let { whereClause, select, limit, orderBy }: GetGigsProps = {};

  // orderBy: GigOrderByWithRelationInput[] = [];

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
    case "recentlyCreated":
      orderBy = [{ createdAt: "desc" }];
      break;

    case "upcoming":
      whereClause = { ...whereClause, gigDate: { gte: new Date() } };
      orderBy = [{ gigDate: "asc" }];
      break;

    case "past":
      whereClause = { ...whereClause, gigDate: { lte: new Date() } };
      orderBy = [{ gigDate: "desc" }];
      break;
  }

  // Number of items per page
  limit = typeof per_page === "string" ? parseInt(per_page) : PER_PAGE;

  // Column and order to sort by specified
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof GigProps | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  console.log("column, order", column, order);

  if (column && order) {
    orderBy = [...orderBy, { [column]: order }];
  }

  // orderBy = [{ [column]: order }];

  console.log(
    "where, limit, orderByx",
    whereClause,
    // select,
    limit,
    orderBy
  );

  //   orderBy: column && column in gigs
  //             ? order === "asc"
  //               ? asc(tasks[column])
  //               : desc(tasks[column])
  //             : desc(tasks.id)
  //         );

  //   where: whereClause,
  //   select: {
  //     id: true,
  //     content: true,
  //     createdAt: true,
  //     _count: { select: { likes: true } },
  //     likes:
  //       currentUserId == null ? false : { where: { userId: currentUserId } },
  //     user: {
  //       select: { name: true, id: true, image: true },
  //     },
  //   },
  // });

  //     const { gigs, totalGigs } = await prisma. (async (tx) => {
  //       const allTasks = await tx
  //         .select()
  //         .from(tasks)
  //         .limit(limit)
  //         .offset(offset)
  //         .where(
  //           and(
  //             // Filter tasks by title
  //             typeof title === "string"
  //               ? like(tasks.title, `%${title}%`)
  //               : undefined,
  //             // Filter tasks by status
  //             statuses.length > 0 ? inArray(tasks.status, statuses) : undefined,
  //             // Filter tasks by priority
  //             priorities.length > 0
  //               ? inArray(tasks.priority, priorities)
  //               : undefined
  //           )
  //         )
  //         .orderBy(
  //           column && column in tasks
  //             ? order === "asc"
  //               ? asc(tasks[column])
  //               : desc(tasks[column])
  //             : desc(tasks.id)
  //         );

  //       const totalTasks = await tx
  //         .select({
  //           count: sql<number>`count(${tasks.id})`,
  //         })
  //         .from(tasks)
  //         .where(
  //           and(
  //             and(
  //               // Filter tasks by title
  //               typeof title === "string"
  //                 ? like(tasks.title, `%${title}%`)
  //                 : undefined
  //             )
  //           )
  //         );

  //       return {
  //         allTasks,
  //         totalTasks: Number(totalTasks[0]?.count) ?? 0,
  //       };
  //     });

  // const pageCount = Math.ceil(totalTasks / limit);

  const data = await getGigs({
    whereClause,
    select,
    limit,
    orderBy,
  });

  // const data =
  //   tab === "upcoming"
  //     ? await getUpcoming()
  //     : tab === "recentlyCreated"
  //     ? await getRecentlyCreated()
  //     : await getPast();

  return <DataTable data={data} pageCount={10} />;
}
