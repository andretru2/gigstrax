import DataTable from "@/components/gigs/data-table";
import { type GigTab } from "@/types/index";
import { redirect } from "next/navigation";
import { getUpcoming, getRecentlyCreated, getPast } from "@/app/_actions/gig";

interface Props {
  params: {
    tab: GigTab;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const TAB_DEFAULT = "upcoming";

export default async function Page({ params, searchParams }: Props) {
  const { tab = TAB_DEFAULT } = searchParams;

  //entering the following on the url works:
  //http://localhost:3002/dashboard/gigs?status=CreateNew

  if (tab === "createNew") return redirect("/dashboard/gigs/new");

  const data =
    tab === "upcoming"
      ? await getUpcoming()
      : tab === "recentlyCreated"
      ? await getRecentlyCreated()
      : await getPast();

  return <DataTable data={data} pageCount={10} />;
}
