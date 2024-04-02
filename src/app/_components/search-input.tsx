"use client";

import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { useTransition } from "react";
import { Spinner } from "./spinner";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const SearchInput = ({ value, onChange, placeholder }: SearchInputProps) => {
  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      startTransition(() => {
        onChange(event.target.value);
      });
    },
    250,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative ">
      <Input
        defaultValue={value}
        onChange={handleSearch}
        placeholder={placeholder}
        className=" bg-white pl-7"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icons.search className="size-3 text-gray-400" />{" "}
      </div>
      {isPending && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Spinner className="size-3" />
        </div>
      )}
    </div>
  );
};

export { SearchInput };
