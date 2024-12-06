import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/repository/category.repository.interface';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { EntityValidationError } from '@core/shared/domain/validator/validator.error';
import { SaveCategoryInput } from './save-category.input';

export class SaveCategoryUseCase
  implements IUseCase<SaveCategoryInput, SaveCategoryOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: SaveCategoryInput): Promise<SaveCategoryOutput> {
    const categoryId = new CategoryId(input.category_id);
    const category = await this.categoryRepo.findById(categoryId);

    return category
      ? this.updateCategory(input, category)
      : this.createCategory(input);
  }

  private async createCategory(input: SaveCategoryInput) {
    const entity = new CategoryAggregate({
      entityId: new CategoryId(input.category_id),
      createdAt: input.created_at,
      isActive: input.is_active ?? true,
      name: input.name,
      description: input.description,
    });
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    await this.categoryRepo.insert(entity);
    return { id: entity.entityId.id, created: true }; //CQS
  }

  private async updateCategory(
    input: SaveCategoryInput,
    category: CategoryAggregate,
  ) {
    category.changeName(input.name);
    category.changeDescription(input.description);

    input.is_active === true ? category.activate() : category.deactivate();

    category.changeCreatedAt(input.created_at);

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.categoryRepo.update(category);

    return { id: category.entityId.id, created: false };
  }
}

export type SaveCategoryOutput = { id: string; created: boolean };
