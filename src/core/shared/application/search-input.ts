import { SortDirection } from '@core/shared/domain/value-object/search-params.vo';

export type SearchInput<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};
