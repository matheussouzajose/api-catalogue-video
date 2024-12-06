import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { CategoryElasticSearchRepository } from '@core/category/infra/db/elastic-search/category-elastic-search.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { setupElasticsearch } from '@core/shared/infra/testing/global-helpers';

describe('DeleteCategoryUseCase Integration Tests', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryElasticSearchRepository;

  const esHelper = setupElasticsearch();

  beforeEach(() => {
    repository = new CategoryElasticSearchRepository(
      esHelper.esClient,
      esHelper.indexName,
    );
    useCase = new DeleteCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const categoryId = new CategoryId();
    await expect(() => useCase.execute({ id: categoryId.id })).rejects.toThrow(
      new NotFoundError(categoryId.id, CategoryAggregate),
    );
  });

  it('should delete a category', async () => {
    const category = CategoryAggregate.fake().aCategory().build();
    await repository.insert(category);
    await useCase.execute({ id: category.entityId.id });
    const result = await repository.findById(category.entityId);
    expect(result?.deletedAt).not.toBeNull();
  });
});
