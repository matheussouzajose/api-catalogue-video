import { ListAllCategoriesQuery } from '@core/category/application/queries/list-all-categories/list-all-categories.query';
import { CategoryAggregate } from '@core/category/domain/entity/category.aggregate';
import { CategoryElasticSearchRepository } from '@core/category/infra/db/elastic-search/category-elastic-search.repository';
import { setupElasticsearch } from '@core/shared/infra/testing/global-helpers';

describe('ListAllCategoriesUseCase Integration Tests', () => {
  let useCase: ListAllCategoriesQuery;
  let repository: CategoryElasticSearchRepository;

  const esHelper = setupElasticsearch();

  beforeEach(() => {
    repository = new CategoryElasticSearchRepository(
      esHelper.esClient,
      esHelper.indexName,
    );
    useCase = new ListAllCategoriesQuery(esHelper.esClient, esHelper.indexName);
  });

  it('should list all categories', async () => {
    const category1 = CategoryAggregate.fake().aCategory().build();
    const category2 = CategoryAggregate.fake().aCategory().build();
    await repository.insert(category1);
    await repository.insert(category2);
    const output = await useCase.execute({
      filter: {
        isActive: true,
      },
      order: { field: 'name', direction: 'asc' },
    });
    expect(output).toHaveLength(2);
    expect(output).toContainEqual({
      id: category1.entityId.id,
      name: category1.name,
      description: category1.description,
      is_active: category1.isActive,
      created_at: category1.createdAt,
      deleted_at: null,
    });
    expect(output).toContainEqual({
      id: category2.entityId.id,
      name: category2.name,
      description: category2.description,
      is_active: category2.isActive,
      created_at: category2.createdAt,
      deleted_at: null,
    });

    category1.markAsDeleted();
    await repository.update(category1);

    const output2 = await useCase.execute({
      filter: {
        isActive: true,
      },
      order: { field: 'name', direction: 'asc' },
    });
    expect(output2).toHaveLength(1);
    expect(output2).toContainEqual({
      id: category2.entityId.id,
      name: category2.name,
      description: category2.description,
      is_active: category2.isActive,
      created_at: category2.createdAt,
      deleted_at: null,
    });
  });
});