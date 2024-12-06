import {
  CategoryOutput,
  CategoryOutputMapper,
} from '@core/category/application/use-cases/common/category-output';
import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/repository/category.repository.interface';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const categoryId = new CategoryId(input.id);
    const category = await this.categoryRepo.ignoreSoftDeleted().findOneBy({
      entityId: categoryId,
      isActive: true,
    });
    if (!category) {
      throw new NotFoundError(input.id, CategoryAggregate);
    }

    return CategoryOutputMapper.toOutput(category);
  }
}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;
