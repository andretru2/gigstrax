import { getClients } from "@/app/_actions/client";

import { type ClientPickerProps } from "@/types/index";
import { type ParsedSearchParams } from "../search-params";
import { ClientSearchInput } from "./client-search-input";
import { ClientPickerCreate } from "./client-picker-create";
// import { ClientSortSelect } from "./client-sort-select";
import { Placeholder } from "../ui/placeholder";
import { ClientPickerSelect } from "./client-picker-select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface Props {
  searchParams?: ParsedSearchParams;
  gigId?: string | undefined;
}

async function fetchClients({ searchParams }: Props) {
  const { data } = await getClients({
    select: {
      id: true,
      client: true,
    },
    whereClause: {
      client: {
        contains: searchParams?.searchClient,
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
        <ClientPickerCreate {...props} />
      </div>
    </div>
  );
}

async function Search(props: Props) {
  const clients = props.searchParams?.searchClient
    ? await fetchClients(props)
    : [];

  return (
    <Card className=" p-4">
      <CardHeader>
        <CardTitle className="pl-2">Search Clients</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <ClientSearchInput placeholder="Search clients ..." />

          <div className="flex flex-col gap-2 divide-y ">
            {clients?.map((client) => (
              <ClientPickerSelect
                key={client.id}
                client={client}
                {...props}
                className="justify-start pl-4 text-left"
              />
            ))}
          </div>
        </div>

        {clients?.length === 0 && props.searchParams?.searchClient && (
          <div className="flex h-[166px] w-[420px] flex-col justify-center">
            <Placeholder label="No clients found" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function Recent(props: Props) {
  const recent = await fetchRecent();
  return (
    <Card className=" h-full w-full p-4">
      <CardHeader>
        <CardTitle className="pl-2">Pick from Recent</CardTitle>
      </CardHeader>
      <CardContent className="grid h-full  grid-cols-3  gap-2   ">
        {recent.map((client) => (
          <ClientPickerSelect
            key={client.id}
            client={client}
            {...props}
            className="flex  max-w-32 items-center justify-center truncate  rounded-full border bg-primary/80 hover:bg-primary "
          />
        ))}
      </CardContent>
    </Card>
  );
}
