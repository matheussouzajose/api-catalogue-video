import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { CategoryElasticSearchRepository } from '@core/category/infra/db/elastic-search/category-elastic-search.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { setupElasticsearch } from '@core/shared/infra/testing/global-helpers';
import { update } from 'lodash';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryElasticSearchRepository;

  const esHelper = setupElasticsearch();

  beforeEach(() => {
    repository = new CategoryElasticSearchRepository(
      esHelper.esClient,
      esHelper.indexName,
    );
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throws error when aggregate not found', async () => {
    const categoryId = new CategoryId();
    await expect(() => useCase.execute({ id: categoryId.id })).rejects.toThrow(
      new NotFoundError(categoryId.id, CategoryAggregate),
    );

    const category = CategoryAggregate.fake().aCategory().build();
    category.markAsDeleted();
    await repository.insert(category);

    await expect(() =>
      useCase.execute({ id: category.entityId.id }),
    ).rejects.toThrow(
      new NotFoundError(category.entityId.id, CategoryAggregate),
    );
  });

  it('should return a category', async () => {
    const category = CategoryAggregate.fake().aCategory().build();
    await repository.insert(category);
    const output = await useCase.execute({ id: category.entityId.id });
    expect(output).toStrictEqual({
      id: category.entityId.id,
      name: category.name,
      description: category.description,
      is_active: category.isActive,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
      deleted_at: null,
    });
  });
});
