import { getClients } from "@/app/_actions/client";
import { getGigs } from "@/app/_actions/gig";

// import { GigClientPickerWrapper } from "@/components/gigs/zzzzgig-client-picker";
import { type ClientPickerProps } from "@/types/index";
import { type SearchParams } from "nuqs/server";

interface Props {
  params: {
    gigId: string;
  };
  searchParams: SearchParams;
}

async function getFilteredClients(clientQuery: string) {
  if (!clientQuery) return undefined;
  const { data } = await getClients({
    select: {
      id: true,
      client: true,
    },
    whereClause: {
      client: {
        contains: clientQuery,
        mode: "insensitive",
      },
    },
    orderBy: [{ client: "asc" }],
  });
  console.log(data);
  return data as ClientPickerProps[];
}

async function getSuggestions() {
  const { data } = await getClients({
    select: {
      id: true,
      client: true,
    },
    orderBy: [{ updatedAt: { sort: "desc", nulls: "last" } }],

    limit: 5,
  });
  console.log(data);
  return data as ClientPickerProps[];
}

async function getClientFromGig(gigId: string) {
  const { data } = await getGigs({
    select: {
      client: {
        select: {
          id: true,
          client: true,
        },
      },
    },
    whereClause: {
      id: gigId,
    },
  });

  return data[0]?.client as ClientPickerProps;
}

export default async function Page(props: Props) {
  const { searchParams } = props;
  const clientsPromise = getFilteredClients(searchParams.clientQuery);
  const suggestionsPromise = getSuggestions();
  const clientPromise = getClientFromGig(props.params.gigId);

  const [clients, suggestions, client] = await Promise.all([
    clientsPromise,
    suggestionsPromise,
    clientPromise,
  ]);

  console.log(clients, suggestions, client);

  return;
  return (
    <GigClientPickerWrapper
      gigId={props.params.gigId}
      clients={clients}
      client={client}
      suggestions={suggestions}
    />
  );
}
