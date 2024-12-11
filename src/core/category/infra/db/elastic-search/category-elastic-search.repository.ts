import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/repository/category.repository.interface';
import {
  CategoryElasticSearchMapper,
  CATEGORY_DOCUMENT_TYPE_NAME,
  CategoryDocument,
} from '@core/category/infra/db/elastic-search/category-elastic-search.mapper';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { ICriteria } from '@core/shared/domain/repository/criteria.interface';
import {
  SearchParams,
  SortDirection,
} from '@core/shared/domain/value-object/search-params.vo';
import { SearchResult } from '@core/shared/domain/value-object/search-result.vo';
import { SoftDeleteElasticSearchCriteria } from '@core/shared/infra/db/elastic-search/soft-delete-elastic-search.criteria';
import {
  QueryDslQueryContainer,
  GetGetResult,
} from '@elastic/elasticsearch/api/types';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export class CategoryElasticSearchRepository implements ICategoryRepository {
  sortableFields: string[] = ['name', 'created_at'];
  sortableFieldsMap: Record<string, string> = {
    name: 'category_name.keyword',
    created_at: 'created_at',
  };
  scopes: Map<string, ICriteria> = new Map();

  constructor(
    private esClient: ElasticsearchService,
    private index: string,
  ) {}

  search(
    props: SearchParams<string>,
  ): Promise<SearchResult<CategoryAggregate>> {
    throw new Error('Method not implemented.');
  }

  async searchByCriteria(
    criterias: ICriteria[],
  ): Promise<SearchResult<CategoryAggregate>> {
    let query: QueryDslQueryContainer = {};
    for (const criteria of criterias) {
      query = criteria.applyCriteria(query);
    }
    const result = await this.esClient.search({
      body: {
        query,
      },
    });
    return new SearchResult({
      total: result.body.hits.total.value,
      current_page: 1,
      per_page: 15,
      items: result.body.hits.hits.map((hit: any) =>
        CategoryElasticSearchMapper.toEntity(hit._id, hit._source),
      ),
    });
  }

  async insert(entity: CategoryAggregate): Promise<void> {
    await this.esClient.index({
      index: this.index,
      id: entity.entityId.id,
      body: CategoryElasticSearchMapper.toDocument(entity),
      refresh: true,
    });
  }

  async bulkInsert(entities: CategoryAggregate[]): Promise<void> {
    await this.esClient.bulk({
      index: this.index,
      refresh: true,
      body: entities.flatMap((entity) => [
        { index: { _id: entity.entityId.id } },
        CategoryElasticSearchMapper.toDocument(entity),
      ]),
    });
  }

  async findById(id: CategoryId): Promise<CategoryAggregate | null> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            match: {
              _id: id.id,
            },
          },
          {
            match: {
              type: CATEGORY_DOCUMENT_TYPE_NAME,
            },
          },
        ],
      },
    };

    query = this.applyScopes(query);

    const result = await this.esClient.search({
      index: this.index,
      body: {
        query,
      },
    });

    const docs = result.body.hits.hits as GetGetResult<CategoryDocument>[];

    if (docs.length === 0) {
      return null;
    }

    const document = docs[0]._source;

    if (!document) {
      return null;
    }

    return CategoryElasticSearchMapper.toEntity(id.id, document);
  }

  async findOneBy(
    filter: Partial<CategoryAggregate>,
  ): Promise<CategoryAggregate | null> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            match: {
              type: CATEGORY_DOCUMENT_TYPE_NAME,
            },
          },
        ],
      },
    };

    if (filter.entityId) {
      //@ts-expect-error - must is an array
      query.bool.must.push({
        match: {
          _id: filter.entityId.id,
        },
      });
    }

    if (filter.isActive !== undefined) {
      //@ts-expect-error - must is an array
      query.bool.must.push({
        match: {
          is_active: filter.isActive,
        },
      });
    }

    query = this.applyScopes(query);

    const result = await this.esClient.search({
      index: this.index,
      body: {
        query,
      },
    });

    const docs = result.body.hits.hits as GetGetResult<CategoryDocument>[];

    if (docs.length === 0) {
      return null;
    }

    const document = docs[0]._source;

    if (!document) {
      return null;
    }

    return CategoryElasticSearchMapper.toEntity(
      docs[0]._id as string,
      document,
    );
  }

  async findBy(
    filter: Partial<CategoryAggregate>,
    order?: {
      field: string;
      direction: SortDirection;
    },
  ): Promise<CategoryAggregate[]> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            match: {
              type: CATEGORY_DOCUMENT_TYPE_NAME,
            },
          },
        ],
      },
    };
    if (filter.entityId) {
      //@ts-expect-error - must is an array
      query.bool.must.push({
        match: {
          _id: filter.entityId.id,
        },
      });
    }

    if (filter.isActive !== undefined) {
      //@ts-expect-error - must is an array
      query.bool.must.push({
        match: {
          is_active: filter.isActive,
        },
      });
    }

    query = this.applyScopes(query);
    const result = await this.esClient.search({
      index: this.index,
      body: {
        query,
        sort:
          order && this.sortableFieldsMap.hasOwnProperty(order.field)
            ? { [this.sortableFieldsMap[order.field]]: order.direction }
            : undefined,
      },
    });

    return result.body.hits.hits.map((hit: any) =>
      CategoryElasticSearchMapper.toEntity(hit._id, hit._source),
    );
  }

  async findAll(): Promise<CategoryAggregate[]> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            match: {
              type: CATEGORY_DOCUMENT_TYPE_NAME,
            },
          },
        ],
      },
    };
    query = this.applyScopes(query);

    const result = await this.esClient.search({
      index: this.index,
      body: {
        query,
      },
    });

    return result.body.hits.hits.map((hit: any) =>
      CategoryElasticSearchMapper.toEntity(hit._id, hit._source),
    );
  }

  async findByIds(
    ids: CategoryId[],
  ): Promise<{ exists: CategoryAggregate[]; not_exists: CategoryId[] }> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            ids: {
              values: ids.map((id) => id.id),
            },
          },
          {
            match: {
              type: CATEGORY_DOCUMENT_TYPE_NAME,
            },
          },
        ],
      },
    };
    query = this.applyScopes(query);

    const result = await this.esClient.search({
      body: {
        query,
      },
    });

    const docs = result.body.hits.hits as GetGetResult<CategoryDocument>[];

    return {
      exists: docs.map((doc) =>
        CategoryElasticSearchMapper.toEntity(doc._id as string, doc._source!),
      ),
      not_exists: ids.filter((id) => !docs.some((doc) => doc._id === id.id)),
    };
  }

  async existsById(
    ids: CategoryId[],
  ): Promise<{ exists: CategoryId[]; not_exists: CategoryId[] }> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            ids: {
              values: ids.map((id) => id.id),
            },
          },
          {
            match: {
              type: CATEGORY_DOCUMENT_TYPE_NAME,
            },
          },
        ],
      },
    };
    query = this.applyScopes(query);

    const result = await this.esClient.search({
      index: this.index,
      _source: false as any,
      body: {
        query,
      },
    });

    const docs = result.body.hits.hits as GetGetResult<CategoryDocument>[];
    const existsCategoryIds = docs.map((m) => new CategoryId(m._id as string));
    const notExistsCategoryIds = ids.filter(
      (id) => !existsCategoryIds.some((e) => e.equals(id)),
    );
    return {
      exists: existsCategoryIds,
      not_exists: notExistsCategoryIds,
    };
  }

  async update(entity: CategoryAggregate): Promise<void> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            match: {
              _id: entity.entityId.id,
            },
          },
        ],
      },
    };
    query = this.applyScopes(query);
    const result = await this.esClient.updateByQuery({
      index: this.index,
      body: {
        query,
        script: {
          source: `
            ctx._source.category_name = params.category_name;
            ctx._source.category_description = params.category_description;
            ctx._source.is_active = params.is_active;
            ctx._source.created_at = params.created_at;
            ctx._source.deleted_at = params.deleted_at;
            ctx._source.updated_at = params.updated_at;
          `,
          params: CategoryElasticSearchMapper.toDocument(entity),
        },
      },
      refresh: true,
    });

    if (result.body.updated == 0) {
      throw new NotFoundError(entity.entityId.id, CategoryAggregate);
    }
  }

  async delete(id: CategoryId): Promise<void> {
    let query: QueryDslQueryContainer = {
      bool: {
        must: [
          {
            match: {
              _id: id.id,
            },
          },
        ],
      },
    };
    query = this.applyScopes(query);
    const result = await this.esClient.deleteByQuery({
      index: this.index,
      body: {
        query,
      },
      refresh: true,
    });

    if (result.body.deleted == 0) {
      throw new NotFoundError(id.id, CategoryAggregate);
    }
  }

  getEntity(): new (...args: any[]) => CategoryAggregate {
    return CategoryAggregate;
  }

  ignoreSoftDeleted(): this {
    this.scopes.set(
      SoftDeleteElasticSearchCriteria.name,
      new SoftDeleteElasticSearchCriteria(),
    );
    return this;
  }

  clearScopes(): this {
    this.scopes.clear();
    return this;
  }

  private applyScopes(query: QueryDslQueryContainer): QueryDslQueryContainer {
    return Array.from(this.scopes.values()).reduce(
      (acc, criteria) => criteria.applyCriteria(acc),
      query,
    );
  }
}
