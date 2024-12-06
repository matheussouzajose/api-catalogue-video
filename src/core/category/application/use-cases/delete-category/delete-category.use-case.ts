import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/repository/category.repository.interface';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class DeleteCategoryUseCase
  implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const categoryId = new CategoryId(input.id);
    const category = await this.categoryRepo
      .ignoreSoftDeleted()
      .findById(categoryId);
    if (!category) {
      throw new NotFoundError(input.id, CategoryAggregate);
    }

    category.markAsDeleted();
    await this.categoryRepo.update(category);
  }
}

export type DeleteCategoryInput = {
  id: string;
};

export type DeleteCategoryOutput = void;
