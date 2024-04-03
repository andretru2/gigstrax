"use client";

import { useQueryState } from "nuqs";
import { SearchInput } from "@/components/search-input";

import { searchParser } from "../search-params";

interface Props {
  placeholder: string;
}

export function ClientSearchInput({ placeholder }: Props) {
  const [search, setSearch] = useQueryState("search", searchParser);

  return (
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder={placeholder}
    />
  );
}
