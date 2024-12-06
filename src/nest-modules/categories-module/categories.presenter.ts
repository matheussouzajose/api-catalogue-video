import { Transform } from 'class-transformer';
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { ListCategoriesOutput } from '@core/category/application/use-cases/list-all-categories/list-all-categories.use-case';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class CategoryCollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: ListCategoriesOutput) {
    this.data = output.map((i) => new CategoryPresenter(i));
  }
}
