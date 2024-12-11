import {
  CategoryAggregate,
  CategoryId,
} from '@core/category/domain/entity/category.aggregate';
import { CategoryElasticSearchRepository } from '@core/category/infra/db/elastic-search/category-elastic-search.repository';
import { FindByDescriptionCriteria } from '@core/category/infra/db/elastic-search/criteria/find-by-description.criteria';
import { FindByNameCriteria } from '@core/category/infra/db/elastic-search/criteria/find-by-name.criteria';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { setupElasticsearch } from '@core/shared/infra/testing/global-helpers';

describe('CategoryElasticSearchRepository Integration Tests', () => {
  const esHelper = setupElasticsearch();
  let repository: CategoryElasticSearchRepository;

  beforeEach(async () => {
    repository = new CategoryElasticSearchRepository(
      esHelper.esClient,
      esHelper.indexName,
    );
  });

  test('should inserts a new entity', async () => {
    const category = CategoryAggregate.create({
      name: 'Movie',
      description: 'some description',
      isActive: false,
    });
    await repository.insert(category);
    const entity = await repository.findById(category.entityId);
    expect(entity!.toJSON()).toStrictEqual(category.toJSON());
  });

  test('should insert many entities', async () => {
    const categories = CategoryAggregate.fake().theCategories(2).build();
    await repository.bulkInsert(categories);
    const { exists: foundCategories } = await repository.findByIds(
      categories.map((g) => g.entityId),
    );
    expect(foundCategories.length).toBe(2);
    expect(foundCategories[0].toJSON()).toStrictEqual(categories[0].toJSON());
    expect(foundCategories[1].toJSON()).toStrictEqual(categories[1].toJSON());
  });

  it('should find a entity by id', async () => {
    let entityFound = await repository.findById(new CategoryId());
    expect(entityFound).toBeNull();

    const entity = CategoryAggregate.create({
      name: 'Movie',
      description: 'some description',
      isActive: false,
    });
    await repository.insert(entity);
    entityFound = await repository.findById(entity.entityId);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());

    entity.markAsDeleted();

    await repository.update(entity);
    await expect(
      repository.ignoreSoftDeleted().findById(entity.entityId),
    ).resolves.toBeNull();
  });

  it('should find a entity by filter', async () => {
    const entity = CategoryAggregate.create({
      name: 'Movie',
      description: 'some description',
      isActive: false,
    });
    await repository.insert(entity);

    let entityFound = await repository.findOneBy({
      entityId: entity.entityId,
    });
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());

    expect(repository.findOneBy({ isActive: true })).resolves.toBeNull();

    entityFound = await repository.findOneBy({
      entityId: entity.entityId,
      isActive: false,
    });
    expect(entityFound?.toJSON()).toStrictEqual(entity.toJSON());

    entity.markAsDeleted();
    await repository.update(entity);

    expect(
      repository.ignoreSoftDeleted().findOneBy({ entityId: entity.entityId }),
    ).resolves.toBeNull();
  });

  it('should find entities by filter and order', async () => {
    const categories = [
      CategoryAggregate.fake().aCategory().withName('a').build(),
      CategoryAggregate.fake().aCategory().withName('b').build(),
    ];

    await repository.bulkInsert(categories);

    let entities = await repository.findBy(
      { isActive: true },
      {
        field: 'name',
        direction: 'asc',
      },
    );

    expect(entities).toStrictEqual([categories[0], categories[1]]);

    entities = await repository.findBy(
      { isActive: true },
      {
        field: 'name',
        direction: 'desc',
      },
    );

    expect(entities).toStrictEqual([categories[1], categories[0]]);

    categories[0].markAsDeleted();
    await repository.update(categories[0]);

    entities = await repository.ignoreSoftDeleted().findBy(
      { isActive: true },
      {
        field: 'name',
        direction: 'asc',
      },
    );

    expect(entities).toStrictEqual([categories[1]]);
  });

  it('should find entities by filter', async () => {
    const entity = CategoryAggregate.create({
      name: 'Movie',
      description: 'some description',
      isActive: false,
    });
    await repository.insert(entity);

    let entities = await repository.findBy({ entityId: entity.entityId });
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));

    entities = await repository.findBy({ isActive: true });
    expect(entities).toHaveLength(0);

    entities = await repository.findBy({
      entityId: entity.entityId,
      isActive: false,
    });
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));

    entity.markAsDeleted();

    await repository.update(entity);

    entities = await repository
      .ignoreSoftDeleted()
      .findBy({ entityId: entity.entityId });
    expect(entities).toHaveLength(0);
  });

  it('should return all categories', async () => {
    const entity = new CategoryAggregate({
      entityId: new CategoryId(),
      name: 'Movie',
      description: 'some description',
      isActive: false,
      createdAt: new Date(),
    });
    await repository.insert(entity);
    let entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));

    entity.markAsDeleted();

    await repository.update(entity);
    entities = await repository.ignoreSoftDeleted().findAll();
    expect(entities).toHaveLength(0);
  });

  it('should return a categories list by ids', async () => {
    const categories = CategoryAggregate.fake().theCategories(2).build();

    await repository.bulkInsert(categories);
    const { exists: foundCategories } = await repository.findByIds(
      categories.map((g) => g.entityId),
    );
    expect(foundCategories.length).toBe(2);
    expect(foundCategories[0].toJSON()).toStrictEqual(categories[0].toJSON());
    expect(foundCategories[1].toJSON()).toStrictEqual(categories[1].toJSON());

    categories[0].markAsDeleted();
    categories[1].markAsDeleted();

    Promise.all([
      await repository.update(categories[0]),
      await repository.update(categories[1]),
    ]);

    const { exists: foundCategories2 } = await repository
      .ignoreSoftDeleted()
      .findByIds(categories.map((g) => g.entityId));
    expect(foundCategories2.length).toBe(0);
  });

  it('should return category id that exists', async () => {
    const category = CategoryAggregate.fake().aCategory().build();
    await repository.insert(category);

    await repository.insert(category);
    const existsResult1 = await repository.existsById([category.entityId]);
    expect(existsResult1.exists[0]).toBeValueObject(category.entityId);
    expect(existsResult1.not_exists).toHaveLength(0);

    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const notExistsResult = await repository.existsById([
      categoryId1,
      categoryId2,
    ]);
    expect(notExistsResult.exists).toHaveLength(0);
    expect(notExistsResult.not_exists).toHaveLength(2);
    expect(notExistsResult.not_exists[0]).toBeValueObject(categoryId1);
    expect(notExistsResult.not_exists[1]).toBeValueObject(categoryId2);

    const existsResult2 = await repository.existsById([
      category.entityId,
      categoryId1,
    ]);

    expect(existsResult2.exists).toHaveLength(1);
    expect(existsResult2.not_exists).toHaveLength(1);
    expect(existsResult2.exists[0]).toBeValueObject(category.entityId);
    expect(existsResult2.not_exists[0]).toBeValueObject(categoryId1);

    category.markAsDeleted();

    await repository.update(category);
    const existsResult3 = await repository
      .ignoreSoftDeleted()
      .existsById([category.entityId]);
    expect(existsResult3.exists).toHaveLength(0);
    expect(existsResult3.not_exists).toHaveLength(1);
    expect(existsResult3.not_exists[0]).toBeValueObject(category.entityId);
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = CategoryAggregate.fake().aCategory().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId.id, CategoryAggregate),
    );

    entity.markAsDeleted();
    await repository.insert(entity);
    await expect(repository.ignoreSoftDeleted().update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId.id, CategoryAggregate),
    );
  });

  it('should update a entity', async () => {
    const entity = CategoryAggregate.fake().aCategory().build();
    await repository.insert(entity);

    entity.changeName('Movie updated');
    await repository.update(entity);

    const entityFound = await repository.findById(entity.entityId);
    expect(entity.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  it('should throw error on delete when a entity not found', async () => {
    const categoryId = new CategoryId();
    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, CategoryAggregate),
    );

    const category = CategoryAggregate.fake().aCategory().build();
    category.markAsDeleted();
    await repository.insert(category);

    await expect(
      repository.ignoreSoftDeleted().delete(category.entityId),
    ).rejects.toThrow(new NotFoundError(category.entityId, CategoryAggregate));
  });

  it('should delete a entity', async () => {
    const entity = new CategoryAggregate({
      entityId: new CategoryId(),
      name: 'Movie',
      description: 'some description',
      isActive: false,
      createdAt: new Date(),
    });
    await repository.insert(entity);

    await repository.delete(entity.entityId);
    await expect(repository.findById(entity.entityId)).resolves.toBeNull();
  });

  it('should search by criteria', async () => {
    const category1 = CategoryAggregate.fake()
      .aCategory()
      .withName('Category 1')
      .withDescription('Description 1')
      .build();

    const category2 = CategoryAggregate.fake()
      .aCategory()
      .withName('Category 2')
      .withDescription('Description 2')
      .build();

    const category3 = CategoryAggregate.fake()
      .aCategory()
      .withName('Category 3')
      .withDescription('Description 3')
      .build();

    const category4 = CategoryAggregate.fake()
      .aCategory()
      .withName('Category 4')
      .withDescription('Description 4')
      .build();

    await repository.bulkInsert([category1, category2, category3, category4]);

    const findByNameCriteria = new FindByNameCriteria('Category 2');
    const result = await repository.searchByCriteria([findByNameCriteria]);
    // console.log(result);

    const findByDescriptionCriteria = new FindByDescriptionCriteria(
      'Description 1',
    );
    const result2 = await repository.searchByCriteria([
      findByDescriptionCriteria,
    ]);
    // console.log(result2);
  });
});
