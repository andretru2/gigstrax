"use client";

import { useQueryState } from "nuqs";
import { SearchInput } from "@/components/search-input";

import { searchParser } from "../search-params";
import { type SantaType } from "@/types/index";

interface Props {
  placeholder: string;
  role: SantaType;
}

export function SourceSearchInput({ placeholder, role }: Props) {
  const [search, setSearch] = useQueryState(
    role === "RBS" ? "searchSanta" : "searchMrsSanta",
    searchParser,
  );

  return (
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder={placeholder}
    />
  );
}
