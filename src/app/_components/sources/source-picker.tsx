import { getSources } from "@/app/_actions/source";

import { type SantaType, type SourcePickerProps } from "@/types/index";
import { type ParsedSearchParams } from "../search-params";
import { SourceSearchInput } from "./source-search-input";
import { SourcePickerCreate } from "./source-picker-create";
// import { SourceSortSelect } from "./Source-sort-select";
import { Placeholder } from "../ui/placeholder";
import { SourcePickerSelect } from "./source-picker-select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { getGig, getGigs } from "@/app/_actions/gig";
import { addHours, subHours } from "@/lib/utils";

interface Props {
  searchParams?: ParsedSearchParams;
  gigId?: string | undefined;
  role: SantaType;
}

async function fetchSources({ searchParams, role }: Props) {
  const search =
    role === "RBS" ? searchParams?.searchSanta : searchParams?.searchMrsSanta;
  console.log("fetch", search);

  if (!search) return [] as SourcePickerProps[];

  const { data } = await getSources({
    select: {
      id: true,
      nameFirst: true,
      nameLast: true,
      role: true,
    },
    whereClause: {
      OR: [
        {
          nameFirst: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          nameLast: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          role: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: [{ nameFirst: "asc" }],
  });

  return data as SourcePickerProps[];
}

async function fetchAvailableSourcesForGig(props: Props): Promise<{
  available: SourcePickerProps[];
  unavailable: SourcePickerProps[];
}> {
  const { gigId, role } = props;

  const gig = gigId && (await getGig(gigId));

  if (!gig) return [];
  const { gigDate, timeStart, timeEnd } = gig;

  if (!gigDate || !timeStart || !timeEnd) {
    return { available: [], unavailable: [] };
  }

  const dateStart = new Date(gigDate.getTime());
  dateStart.setHours(timeStart.getHours(), timeStart.getMinutes());

  const dateEnd = new Date(gigDate.getTime());
  dateEnd.setHours(timeEnd.getHours(), timeEnd.getMinutes());

  const { data: santas } = await getSources({
    select: {
      id: true,
      role: true,
    },
    whereClause: {
      status: "Active",
      role: {
        contains: role,
      },
    },
    limit: 100,
  });

  const santaIds = santas.map((santa) => santa.id);

  const santaIdKey = role === "RBS" ? "santaId" : "mrsSantaId";

  const { data: unavailableSantaIds } = await getGigs({
    select: {
      id: true,
      [santaIdKey]: true,
    },
    whereClause: {
      gigDate: gigDate,
      OR: [
        { timeStart: { lte: subHours(dateStart, 4) } },
        { timeEnd: { gte: addHours(dateEnd, 4) } },
        { timeStart: { equals: dateStart } },
        { timeEnd: { equals: dateEnd } },
      ],
      [santaIdKey]: { not: null },
      id: { not: gigId },
    },
  });

  const unavailableIds = [
    ...new Set(
      unavailableSantaIds.map((unavailableSanta) => unavailableSanta.santaId),
    ),
  ];

  const availableIds = santaIds.filter(
    (santa) => !unavailableIds.includes(santa),
  );
  // console.log(santas, availableIds, unavailableIds);

  const available = santas
    .filter((santa) => availableIds.includes(santa.id))
    .sort((a, b) => (a.role && b.role ? a.role.localeCompare(b?.role) : 1))
    .map(
      (santa): SourcePickerProps => ({
        ...santa,
      }),
    );

  const unavailable = santas
    .filter((santa) => unavailableIds.includes(santa.id))
    .sort((a, b) => (a.role && b.role ? a.role.localeCompare(b.role) : 1))
    .map(
      (santa): SourcePickerProps => ({
        ...santa,
      }),
    );

  return {
    available: available,
    unavailable: unavailable,
  };

  // return { available, unavailable };
}

export function SourcePicker(props: Props) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="flex w-full items-center justify-center text-base font-bold">
        {props.role === "RBS" ? "Santa Picker" : "Mrs. Santa Picker"}
      </h2>
      <div className="flex w-full flex-col gap-4">
        <Search {...props} />
        <span className="flexw-full items-center justify-center">—or—</span>
        <Availability {...props} />
        <span className="flex w-full items-center justify-center">—or—</span>
        <SourcePickerCreate {...props} />
      </div>
    </div>
  );
}

async function Search(props: Props) {
  const search =
    props.role === "RBS"
      ? props.searchParams?.searchSanta
      : props.searchParams?.searchMrsSanta;

  const sources = search ? await fetchSources(props) : [];

  console.log(search, sources);

  return (
    <Card className=" p-4">
      <CardHeader>
        <CardTitle className="pl-2">Search</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <SourceSearchInput {...props} placeholder="Search ..." />

          <div className="flex flex-col gap-2 divide-y ">
            {sources?.map((source) => (
              <SourcePickerSelect
                key={source.id}
                source={source}
                {...props}
                className="justify-start pl-4 text-left"
              />
            ))}
          </div>
        </div>

        {sources?.length === 0 && search && (
          <div className="flex h-[166px] w-[420px] flex-col justify-center">
            <Placeholder label="No sources found" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

async function Availability(props: Props) {
  const { available, unavailable } = await fetchAvailableSourcesForGig({
    ...props,
  });
  return (
    <Card className=" h-full max-h-96 w-full overflow-y-scroll p-4">
      <CardHeader>
        <CardTitle className="pl-2">Availability</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4   ">
        <div className="space-y-2">
          <h4>Available</h4>
          <div className="grid grid-cols-3 gap-2 divide-y ">
            {available &&
              available.map((source) => (
                <SourcePickerSelect
                  key={source.id}
                  source={source}
                  {...props}
                  className="flex  max-w-32 items-center justify-center truncate  rounded-full border bg-primary/80 hover:bg-primary "
                />
              ))}
          </div>
          <h4>UNavailable</h4>
          <div className="grid grid-cols-3 gap-2 divide-y ">
            {unavailable &&
              unavailable.map((source) => (
                <SourcePickerSelect
                  key={source.id}
                  source={source}
                  {...props}
                  className="flex  max-w-32 items-center justify-center truncate  rounded-full border bg-primary/80 hover:bg-primary "
                />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
