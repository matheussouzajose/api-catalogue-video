import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import { ICriteria } from '@core/shared/domain/repository/criteria.interface';
import { SortDirection } from '@core/shared/domain/value-object/search-params.vo';
import { ValueObject } from '@core/shared/domain/value-object/value-object';

export interface IRepository<
  E extends AggregateRoot,
  EntityId extends ValueObject,
> {
  sortableFields: string[];
  scopes: Map<string, ICriteria>;
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  findById(id: EntityId): Promise<E | null>;
  findOneBy(filter: Partial<E>): Promise<E | null>;
  findBy(
    filter: Partial<E>,
    order?: {
      field: string;
      direction: SortDirection;
    },
  ): Promise<E[]>;
  findAll(): Promise<E[]>;
  findByIds(ids: EntityId[]): Promise<{ exists: E[]; not_exists: EntityId[] }>;
  existsById(ids: EntityId[]): Promise<{
    exists: EntityId[];
    not_exists: EntityId[];
  }>;
  update(entity: E): Promise<void>;
  delete(id: EntityId): Promise<void>;
  ignoreSoftDeleted(): this;
  clearScopes(): this;
  getEntity(): new (...args: any[]) => E;
}
