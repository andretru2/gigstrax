import { getClients } from "@/app/_actions/client";

import { type ClientPickerProps } from "@/types/index";
import { type ParsedSearchParams } from "./search-params";
import { ClientSearchInput } from "./client-search-input";
import { ClientSortSelect } from "./client-sort-select";
import { Placeholder } from "../ui/placeholder";
import { GigClientPickerSelect } from "../gigs/gig-client-picker-select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface Props {
  searchParams?: ParsedSearchParams;
  // onSelect?: (client: ClientPickerProps) => void;
  gigId?: string;
}

async function fetchClients({ searchParams }: Props) {
  const { data } = await getClients({
    select: {
      id: true,
      client: true,
    },
    whereClause: {
      client: {
        contains: searchParams?.search,
        mode: "insensitive",
      },
    },
    orderBy: [{ client: "asc" }],
  });

  return data as ClientPickerProps[];
}

async function fetchRecent() {
  const { data } = await getClients({
    select: {
      id: true,
      client: true,
    },
    orderBy: [{ updatedAt: { sort: "desc", nulls: "last" } }],
    limit: 5,
  });
  return data as ClientPickerProps[];
}

export function ClientPicker(props: Props) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="flex w-full items-center justify-center text-base font-bold">
        Client Picker
      </h2>
      <div className="flex w-full flex-col gap-4">
        <Search {...props} />
        <span className="flex w-full items-center justify-center">—or—</span>
        <Recent {...props} />
        <span className="flex w-full items-center justify-center">—or—</span>
        {/* <Create {...props} /> */}
      </div>
    </div>
  );
}

async function Search(props: Props) {
  const clients = props.searchParams?.search ? await fetchClients(props) : [];

  return (
    <Card className=" p-4">
      <CardHeader>
        <CardTitle className="pl-2">Search Clients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <ClientSearchInput placeholder="Search clients ..." />

          <div className="  flex flex-col gap-2 divide-y truncate rounded-md border bg-white p-4">
            {clients?.map(
              (client) =>
                props.gigId && (
                  <GigClientPickerSelect
                    key={client.id}
                    client={client}
                    {...props}
                  />
                ),
            )}
          </div>

          {clients?.length === 0 && (
            <div className="flex h-[166px] w-[420px] flex-col justify-center">
              <Placeholder label="No clients found" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

async function Recent(props: Props) {
  const recent = await fetchRecent();
  return (
    <Card className=" p-4">
      <CardHeader>
        <CardTitle className="pl-2">Pick from Recent</CardTitle>
      </CardHeader>
      <CardContent className="flex  flex-row gap-2">
        {recent.map((client) => (
          <GigClientPickerSelect
            key={client.id}
            client={client}
            {...props}
            className="flex items-center justify-center truncate rounded-md bg-primary"
          />
        ))}
      </CardContent>
    </Card>
  );
}
