import DataTable from "@/components/clients/data-table";
import { type Tab } from "@/types/index";
import { redirect } from "next/navigation";
import { getClients } from "@/app/_actions/client";

interface Props {
  params: {
    tab: Tab;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const TAB_DEFAULT = "all";

export const revalidate = 120;

export default async function Page({ params, searchParams }: Props) {
  const { tab = TAB_DEFAULT } = searchParams;

  // console.log("revalidate");
  //entering the following on the url works:
  //http://localhost:3002/dashboard/gigs?status=CreateNew

  // if (tab === "createNew") return redirect("/dashboard/gigs/new");

  const data =
    tab === "recentlyCreated"
      ? await getClients({
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
            _count: {
              select: {
                gigs: true,
              },
            },
          },
          orderBy: [{ createdAt: "desc" }, { client: "asc" }],
          limit: 10,
        })
      : await getClients({});

  return <DataTable data={data} pageCount={10} />;
}
