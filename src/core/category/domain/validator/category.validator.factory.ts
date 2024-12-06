import { CategoryValidator } from '@core/category/domain/validator/category.validator';

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
