import {
  CategoryOutputMapper,
  CategoryOutput,
} from '@core/category/application/use-cases/common/category-output';
import { CategoryAggregate } from '@core/category/domain/entity/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/repository/category.repository.interface';
import {
  CATEGORY_DOCUMENT_TYPE_NAME,
  CategoryDocument,
} from '@core/category/infra/db/elastic-search/category-elastic-search.mapper';
import { IQuery } from '@core/shared/application/query.interface';
import { ICriteria } from '@core/shared/domain/repository/criteria.interface';
import { SortDirection } from '@core/shared/domain/value-object/search-params.vo';
import { SoftDeleteElasticSearchCriteria } from '@core/shared/infra/db/elastic-search/soft-delete-elastic-search.criteria';
import {
  QueryDslQueryContainer,
  GetGetResult,
} from '@elastic/elasticsearch/api/types';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export class ListAllCategoriesQuery
  implements IQuery<ListCategoriesInput, ListCategoriesOutput>
{
  sortableFields: string[] = ['name', 'created_at'];
  sortableFieldsMap: Record<string, string> = {
    name: 'category_name',
    created_at: 'created_at',
  };
  scopes: Map<string, ICriteria> = new Map();

  constructor(
    private esClient: ElasticsearchService,
    private index: string,
  ) {}

  async execute(input: ListCategoriesInput): Promise<any> {
    const { filter } = input;
    this.ignoreSoftDeleted();

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

    return docs.map((doc) => ({
      id: doc._id,
      name: doc._source.category_name,
      description: doc._source.category_description,
      is_active: doc._source.is_active,
      created_at: new Date(doc._source.created_at),
      deleted_at: doc._source.deleted_at
        ? new Date(doc._source.deleted_at)
        : null,
    }));
  }

  private applyScopes(query: QueryDslQueryContainer): QueryDslQueryContainer {
    return Array.from(this.scopes.values()).reduce(
      (acc, criteria) => criteria.applyCriteria(acc),
      query,
    );
  }

  ignoreSoftDeleted(): this {
    this.scopes.set(
      SoftDeleteElasticSearchCriteria.name,
      new SoftDeleteElasticSearchCriteria(),
    );
    return this;
  }
}

export type ListCategoriesInput = {
  filter: Partial<CategoryAggregate>;
  order?: {
    field: string;
    direction: SortDirection;
  };
};

export type ListCategoriesOutput = CategoryOutput[];
