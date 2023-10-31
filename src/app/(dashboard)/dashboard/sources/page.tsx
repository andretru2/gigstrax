import DataTable from "@/components/sources/data-table";
import { type GetSourcesProps, type Tab } from "@/types/index";
import { getSources } from "@/app/_actions/source";
import { PER_PAGE } from "@/lib/constants";
import { type SourceStatus } from "@prisma/client";

interface Props {
  params: {
    tab: Tab;
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
    nameFirst,
    nameLast,
    status,
    tab = "all",
  } = searchParams ?? {};

  let { whereClause, select, limit, orderBy }: GetSourcesProps = {};

  select = {
    id: true,
    role: true,
    nameFirst: true,
    nameLast: true,
    email: true,
    addressCity: true,
    addressState: true,
    addressStreet: true,
    addressZip: true,
    notes: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    dob: true,
    updatedBy: true,
    status: true,
    entity: true,
    phone: true,
    resource: true,
    website: true,
    ssn: true,
    videoUrl: true,
    gender: true,
    costume: true,
  };

  whereClause = {
    nameFirst: { not: undefined },
  };

  switch (tab) {
    /** TODO: add to search params instead */
    case "recentlyCreated":
      orderBy = [{ updatedAt: { sort: "desc", nulls: "last" } }];

      // orderBy = [{ createdAt: "desc" }];
      break;

    case "all":
      orderBy = [];
      break;
  }

  limit = parseInt(per_page as string) || PER_PAGE;
  const skip = (parseInt(page as string) - 1) * limit || 0;
  const [column, order] = (sort as string)?.split(".") || [];

  if (column && order) {
    orderBy =
      orderBy && orderBy.length > 0
        ? [...orderBy, { [column]: order }]
        : [{ [column]: order }];
  }
  if (nameFirst) {
    whereClause.nameFirst = {
      contains: nameFirst as string,
      mode: "insensitive",
    };
  }

  if (nameLast) {
    whereClause.nameLast = {
      contains: nameLast as string,
      mode: "insensitive",
    };
  }

  if (status) {
    const statuses = (status as string).split(".");

    whereClause.status = {
      in: statuses.map((s) => s as SourceStatus),
    };
  }

  const { data, totalCount } = await getSources({
    whereClause,
    select,
    limit,
    orderBy,
    skip,
  });

  const pageCount = Math.ceil(totalCount / limit);

  return <DataTable data={data} pageCount={pageCount} />;
}
