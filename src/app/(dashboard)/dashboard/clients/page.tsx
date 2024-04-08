import DataTable from "@/components/clients/data-table";
import { getClients } from "@/app/_actions/client";
import { type GetClientsProps } from "@/types/index";
import { PER_PAGE } from "@/lib/constants";
import { type SearchParams } from "nuqs/server";
import { ClientTabs } from "@/components/clients/client-tabs";

// export const dynamic = "force-dynamic";
// export const cache = "no-store";
export const revalidate = 0;

interface Props {
  searchParams: SearchParams;
}

// export const revalidate = 120;

export default async function Page({ searchParams }: Props) {
  // const {  tab = "all"} = params;
  const {
    page,
    per_page = PER_PAGE,
    sort,
    client,
    tab = "all",
  } = searchParams ?? {};

  let { whereClause, select, limit, orderBy }: GetClientsProps = {};

  select = {
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
    // _count: {
    //   select: {
    //     gigs: true,
    //   },
    // },
  };

  whereClause = {
    client: { not: undefined },
  };

  switch (tab) {
    /** TODO: add to search params instead */
    case "recentlyCreated":
      // orderBy = [{ createdAt: "desc" }];
      orderBy = [{ updatedAt: { sort: "desc", nulls: "last" } }];

      break;

    case "all":
      orderBy = [];
      break;
  }

  // console.log(orderBy, tab);

  limit = parseInt(per_page as string) || PER_PAGE;
  const skip = (parseInt(page as string) - 1) * limit || 0;
  const [column, order] = (sort as string)?.split(".") || [];

  if (column && order) {
    orderBy =
      orderBy && orderBy.length > 0
        ? [...orderBy, { [column]: order }]
        : [{ [column]: order }];
  }

  if (client) {
    whereClause = {
      client: {
        contains: client as string,
        mode: "insensitive",
      },
    };
  }

  const { data, totalCount } = await getClients({
    whereClause,
    select,
    limit,
    orderBy,
    skip,
  });

  const pageCount = Math.ceil(totalCount / limit);

  return (
    <>
      <ClientTabs />
      <DataTable data={data} pageCount={pageCount} />
      {/* <ClientPicker searchParams={searchParamsCache?.parse(searchParams)} /> */}
    </>
  );
}
