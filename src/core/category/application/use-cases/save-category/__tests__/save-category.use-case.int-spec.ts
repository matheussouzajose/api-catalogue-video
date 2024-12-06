import { SaveCategoryUseCase } from '../save-category.use-case';
import { SaveCategoryInput } from '../save-category.input';
import { setupElasticsearch } from '../../../../../shared/infra/testing/global-helpers';
import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { CategoryElasticSearchRepository } from '@core/category/infra/db/elastic-search/category-elastic-search.repository';

describe('SaveCategoryUseCase Integration Tests', () => {
  let useCase: SaveCategoryUseCase;
  let repository: CategoryElasticSearchRepository;

  const esHelper = setupElasticsearch();

  beforeEach(() => {
    repository = new CategoryElasticSearchRepository(
      esHelper.esClient,
      esHelper.indexName,
    );
    useCase = new SaveCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    const uuid = '4e9e2e4e-0d1a-4a4b-8c0a-5b0e4e4e4e4e';
    const created_at = new Date();
    const output = await useCase.execute(
      new SaveCategoryInput({
        category_id: uuid,
        name: 'test',
        description: 'some description',
        is_active: false,
        created_at: created_at,
      }),
    );
    const entity = await repository.findById(new CategoryId(uuid));
    expect(output).toStrictEqual({
      id: uuid,
      created: true,
    });
    expect(entity).toMatchObject({
      name: 'test',
      description: 'some description',
      isActive: false,
      createdAt: created_at,
    });
  });

  it('should update a category', async () => {
    const uuid = '4e9e2e4e-0d1a-4a4b-8c0a-5b0e4e4e4e4e';
    const created_at = new Date();
    const category = CategoryAggregate.fake().aCategory().build();
    await repository.insert(category);
    const output = await useCase.execute(
      new SaveCategoryInput({
        category_id: uuid,
        name: 'test',
        description: 'some description',
        is_active: false,
        created_at: created_at,
      }),
    );
    expect(output).toStrictEqual({
      id: uuid,
      created: true,
    });
    const entity = await repository.findById(new CategoryId(uuid));
    expect(entity).toMatchObject({
      name: 'test',
      description: 'some description',
      isActive: false,
      createdAt: created_at,
    });
  });
});
