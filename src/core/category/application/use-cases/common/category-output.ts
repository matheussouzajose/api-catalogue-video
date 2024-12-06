import { CategoryAggregate } from '@core/category/domain/entity/category.aggregate';

export type CategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  deleted_at: Date | null;
};

export class CategoryOutputMapper {
  static toOutput(entity: CategoryAggregate): CategoryOutput {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category_id, ...other_props } = entity.toJSON();
    return {
      id: category_id,
      ...other_props,
    };
  }
}
