import {
  CategoryOutputMapper,
  CategoryOutput,
} from '@core/category/application/use-cases/common/category-output';
import { ICategoryRepository } from '@core/category/domain/repository/category.repository.interface';
import { SearchInput } from '@core/shared/application/search-input';
import { IUseCase } from '@core/shared/application/use-case.interface';

export class ListAllCategoriesUseCase
  implements IUseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(): Promise<ListCategoriesOutput> {
    const categories = await this.categoryRepo.ignoreSoftDeleted().findBy(
      {
        isActive: true,
      },
      { field: 'name', direction: 'asc' },
    );
    return categories.map(CategoryOutputMapper.toOutput);
  }
}

export type ListCategoriesInput = SearchInput;

export type ListCategoriesOutput = CategoryOutput[];
