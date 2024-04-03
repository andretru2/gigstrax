import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
} from "nuqs/server";

export const searchParser = parseAsString.withDefault("").withOptions({
  shallow: false,
  clearOnDefault: true,
});

export const modalOpenParser = parseAsBoolean.withDefault(false).withOptions({
  clearOnDefault: true,
});

export const sortParser = {
  sortKey: parseAsString.withDefault("createdAt"),
  sortValue: parseAsString.withDefault("desc"),
};

export const sortOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const paginationParser = {
  page: parseAsInteger.withDefault(0),
  size: parseAsInteger.withDefault(5),
};

export const paginationOptions = {
  shallow: false,
  clearOnDefault: true,
};

export const fieldErrorParser = {
  key: parseAsString.withDefault(""),
  error: parseAsString.withDefault(""),
};

export const searchParamsCache = createSearchParamsCache({
  search: searchParser,
  modalOpen: modalOpenParser,
  ...fieldErrorParser,
  ...sortParser,
  ...paginationParser,
});

export type ParsedSearchParams = ReturnType<typeof searchParamsCache.parse>;
