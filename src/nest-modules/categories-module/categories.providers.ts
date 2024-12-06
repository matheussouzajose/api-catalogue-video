import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { ListAllCategoriesUseCase } from '@core/category/application/use-cases/list-all-categories/list-all-categories.use-case';
import { SaveCategoryUseCase } from '@core/category/application/use-cases/save-category/save-category.use-case';
import { ICategoryRepository } from '@core/category/domain/repository/category.repository.interface';
import { CategoryElasticSearchRepository } from '@core/category/infra/db/elastic-search/category-elastic-search.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export const REPOSITORIES = {
  CATEGORY_REPOSITORY: {
    provide: 'CategoryRepository',
    useExisting: CategoryElasticSearchRepository,
  },
  CATEGORY_ELASTIC_SEARCH_REPOSITORY: {
    provide: CategoryElasticSearchRepository,
    useFactory: (esClient: ElasticsearchService) => {
      return new CategoryElasticSearchRepository(esClient, 'api_catalogue');
    },
    inject: [ElasticsearchService],
  },
};

export const USE_CASES = {
  SAVE_CATEGORY_USE_CASE: {
    provide: SaveCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new SaveCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  LIST_CATEGORIES_USE_CASE: {
    provide: ListAllCategoriesUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new ListAllCategoriesUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new GetCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUseCase,
    useFactory: (categoryRepo: ICategoryRepository) => {
      return new DeleteCategoryUseCase(categoryRepo);
    },
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
};

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
