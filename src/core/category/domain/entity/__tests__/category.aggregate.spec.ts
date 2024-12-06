import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';

describe('Category Unit Tests', () => {
  beforeEach(() => {
    CategoryAggregate.prototype.validate = jest
      .fn()
      .mockImplementation(CategoryAggregate.prototype.validate);
  });

  it('Should be restore a category', () => {
    const category = new CategoryAggregate({
      entityId: new CategoryId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Category',
      description: 'Description',
      isActive: true,
    });

    expect(category.entityId).toBeInstanceOf(CategoryId);
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.deletedAt).toBeNull();
    expect(category.name).toBe('Category');
    expect(category.description).toBe('Description');
    expect(category.isActive).toBeTruthy();

    expect(CategoryAggregate.prototype.validate).toHaveBeenCalledTimes(1);
    expect(category.notification.hasErrors()).toBe(false);
  });

  it('Should create a category without description and status', () => {
    const category = CategoryAggregate.create({
      name: 'Category',
    });

    expect(category.entityId).toBeInstanceOf(CategoryId);
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.deletedAt).toBeNull();
    expect(category.name).toBe('Category');
    expect(category.description).toBeNull();
    expect(category.isActive).toBeTruthy();

    expect(CategoryAggregate.prototype.validate).toHaveBeenCalledTimes(1);
    expect(category.notification.hasErrors()).toBe(false);
  });

  it('Should create a category without status', () => {
    const category = CategoryAggregate.create({
      name: 'Category',
      description: 'Description',
    });

    expect(category.entityId).toBeInstanceOf(CategoryId);
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.deletedAt).toBeNull();
    expect(category.name).toBe('Category');
    expect(category.description).toBe('Description');
    expect(category.isActive).toBeTruthy();

    expect(CategoryAggregate.prototype.validate).toHaveBeenCalledTimes(1);
    expect(category.notification.hasErrors()).toBe(false);
  });

  it('Should create a category', () => {
    const category = CategoryAggregate.create({
      name: 'Category',
      description: 'Description',
      isActive: false,
    });

    expect(category.entityId).toBeInstanceOf(CategoryId);
    expect(category.createdAt).toBeInstanceOf(Date);
    expect(category.updatedAt).toBeInstanceOf(Date);
    expect(category.deletedAt).toBeNull();
    expect(category.name).toBe('Category');
    expect(category.description).toBe('Description');
    expect(category.isActive).toBeFalsy();

    expect(CategoryAggregate.prototype.validate).toHaveBeenCalledTimes(1);
    expect(category.notification.hasErrors()).toBe(false);
  });

  it('Should update a category', () => {
    const category = new CategoryAggregate({
      entityId: new CategoryId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'Category',
      description: 'Description',
      isActive: true,
    });

    category.changeName('Category 2');
    expect(category.name).toBe('Category 2');

    category.changeDescription('Description 2');
    expect(category.description).toBe('Description 2');

    category.deactivate();
    expect(category.isActive).toBeFalsy();

    category.activate();
    expect(category.isActive).toBeTruthy();
  });

  it('Should an invalid category with name property', () => {
    const category = CategoryAggregate.create({ name: 't'.repeat(256) });

    expect(category.notification.hasErrors()).toBe(true);
    expect(category.notification.toJSON()).toEqual([
      { _name: ['_name must be shorter than or equal to 255 characters'] },
    ]);
  });
});
