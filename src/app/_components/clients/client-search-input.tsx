"use client";

import { useQueryState } from "nuqs";
import { SearchInput } from "@/components/search-input";

import { searchParser } from "../search-params";

interface Props {
  placeholder: string;
}

export function ClientSearchInput({ placeholder }: Props) {
  const [search, setSearch] = useQueryState("searchClient", searchParser);

  return (
    <SearchInput
      value={search}
      //eslint-disable-next-line @typescript-eslint/no-misused-promises
      onChange={setSearch}
      placeholder={placeholder}
    />
  );
}
