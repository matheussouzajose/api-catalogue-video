import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { LoadEntityError } from '@core/shared/domain/validator/validator.error';

export const CATEGORY_DOCUMENT_TYPE_NAME = 'Category';

export type CategoryDocument = {
  category_name: string;
  category_description: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
  type: typeof CATEGORY_DOCUMENT_TYPE_NAME;
};

export class CategoryElasticSearchMapper {
  static toEntity(id: string, document: CategoryDocument): CategoryAggregate {
    if (document.type !== CATEGORY_DOCUMENT_TYPE_NAME) {
      throw new Error('Invalid document type');
    }
    const category = new CategoryAggregate({
      entityId: new CategoryId(id),
      name: document.category_name,
      description: document.category_description,
      isActive: document.is_active,
      createdAt: !(document.created_at instanceof Date)
        ? new Date(document.created_at)
        : document.created_at,
      updatedAt: !(document.updated_at instanceof Date)
        ? new Date(document.updated_at)
        : document.updated_at,
      deletedAt:
        document.deleted_at === null
          ? null
          : !(document.deleted_at instanceof Date)
            ? new Date(document.deleted_at!)
            : document.deleted_at,
    });

    category.validate();
    if (category.notification.hasErrors()) {
      throw new LoadEntityError(category.notification.toJSON());
    }
    return category;
  }

  static toDocument(entity: CategoryAggregate): CategoryDocument {
    return {
      category_name: entity.name,
      category_description: entity.description,
      is_active: entity.isActive,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: entity.deletedAt,
      type: CATEGORY_DOCUMENT_TYPE_NAME,
    };
  }
}
