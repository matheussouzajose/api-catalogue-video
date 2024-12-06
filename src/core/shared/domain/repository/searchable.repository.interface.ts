import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import { ICriteria } from '@core/shared/domain/repository/criteria.interface';
import { IRepository } from '@core/shared/domain/repository/repository.interface';
import { SearchParams } from '@core/shared/domain/value-object/search-params.vo';
import { SearchResult } from '@core/shared/domain/value-object/search-result.vo';
import { ValueObject } from '@core/shared/domain/value-object/value-object';

export interface ISearchableRepository<
  E extends AggregateRoot,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult<E>,
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
  searchByCriteria(criterias: ICriteria[]): Promise<SearchOutput>;
}
