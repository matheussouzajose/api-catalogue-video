import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { IRepository } from '@core/shared/domain/repository/repository.interface';
import { ISearchableRepository } from '@core/shared/domain/repository/searchable.repository.interface';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '@core/shared/domain/value-object/search-params.vo';
import { SearchResult } from '@core/shared/domain/value-object/search-result.vo';

export type CategoryFilter = {
  name?: string | null;
  is_active?: boolean;
};

export class CategorySearchParams extends SearchParams<CategoryFilter> {
  private constructor(props: SearchParamsConstructorProps<CategoryFilter>) {
    super(props);
  }

  static create(
    props: Omit<SearchParamsConstructorProps<CategoryFilter>, 'filter'> & {
      filter?: {
        name?: string | null;
        is_active?: boolean;
      };
    } = {},
  ) {
    return new CategorySearchParams({
      ...props,
      filter: {
        name: props.filter?.name,
        is_active: props.filter?.is_active,
      },
    });
  }

  get filter(): CategoryFilter | null {
    return this._filter;
  }

  protected set filter(value: CategoryFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;

    const filter = {
      ...(_value && _value.name && { name: `${_value?.name}` }),
      ...(_value &&
        _value.is_active !== undefined && {
          is_active:
            _value.is_active === ('true' as any) ||
            _value.is_active === true ||
            _value.is_active === (1 as any) ||
            _value.is_active === ('1' as any),
        }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class CategorySearchResult extends SearchResult<CategoryAggregate> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
// export interface ICategoryRepository
//   extends IRepository<CategoryAggregate, CategoryId> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICategoryRepository
  extends ISearchableRepository<CategoryAggregate, CategoryId> {}
