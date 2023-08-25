import DataTable from "@/components/sources/data-table";
import { type Tab } from "@/types/index";
import { redirect } from "next/navigation";
import { getSources } from "@/app/_actions/source";

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
      ? await getSources({
          select: {
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
          },
          orderBy: [{ createdAt: "desc" }, { nameLast: "asc" }],
          limit: 10,
        })
      : await getSources({});

  return <DataTable data={data} pageCount={10} />;
}
