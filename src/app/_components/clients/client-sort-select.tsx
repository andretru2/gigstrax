"use client";

import { useQueryStates } from "nuqs";
import { SortSelect, type SortSelectOption } from "@/components/sort-select";
import { sortParser, sortOptions } from "../search-params";

interface Props {
  options: SortSelectOption[];
}

export function ClientSortSelect({ options }: Props) {
  const [sort, setSort] = useQueryStates(sortParser, sortOptions);
  //eslint-disable-next-line @typescript-eslint/no-misused-promises
  return <SortSelect value={sort} onChange={setSort} options={options} />;
}
