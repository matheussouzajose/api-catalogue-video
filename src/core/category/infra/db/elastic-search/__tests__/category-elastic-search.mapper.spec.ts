import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import {
  CategoryDocument,
  CATEGORY_DOCUMENT_TYPE_NAME,
  CategoryElasticSearchMapper,
} from '@core/category/infra/db/elastic-search/category-elastic-search.mapper';

describe('CategoryElasticSearchMapper', () => {
  let categoryDocument: CategoryDocument;
  let category: CategoryAggregate;

  beforeEach(() => {
    categoryDocument = {
      category_name: 'Test',
      category_description: 'Test description',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      type: CATEGORY_DOCUMENT_TYPE_NAME,
    };
    const id = new CategoryId();

    category = new CategoryAggregate({
      entityId: id,
      name: categoryDocument.category_name,
      description: categoryDocument.category_description,
      isActive: categoryDocument.is_active,
      createdAt: categoryDocument.created_at as Date,
      updatedAt: categoryDocument.updated_at as Date,
    });
  });

  describe('toEntity', () => {
    it('should convert document to entity', async () => {
      const result = CategoryElasticSearchMapper.toEntity(
        category.entityId.id,
        categoryDocument,
      );
      expect(result).toEqual(category);

      categoryDocument.deleted_at = new Date();
      category.markAsDeleted();
      const result2 = CategoryElasticSearchMapper.toEntity(
        category.entityId.id,
        categoryDocument,
      );
      expect(result2).toEqual(category);
    });
  });

  describe('toDocument', () => {
    it('should convert entity to document', () => {
      const result = CategoryElasticSearchMapper.toDocument(category);
      expect(result).toEqual(categoryDocument);

      category.markAsDeleted();
      categoryDocument.deleted_at = category.deletedAt;

      const result2 = CategoryElasticSearchMapper.toDocument(category);
      expect(result2).toEqual(categoryDocument);
    });
  });
});
