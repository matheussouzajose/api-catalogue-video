import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { CategoryAggregate } from '@core/category/domain/entity/category.aggregate';

describe('CategoryOutputMapper Unit Tests', () => {
  it('should convert a category in output', () => {
    const entity = CategoryAggregate.create({
      name: 'Movie',
      description: 'some description',
      isActive: true,
    });
    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = CategoryOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.entityId.id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: null,
    });

    entity.markAsDeleted();
    const outputDeleted = CategoryOutputMapper.toOutput(entity);
    expect(outputDeleted).toStrictEqual({
      id: entity.entityId.id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      deleted_at: entity.deletedAt,
    });
  });
});
