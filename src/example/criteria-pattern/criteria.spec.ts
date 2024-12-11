import {
  AndCriteria,
  FindByDescriptionCriteria,
  FindByNameCriteria,
  OrCriteria,
} from './criteria';

describe('Criteria pattern', () => {
  it('find by name', () => {
    const categoriesCollection = [
      { name: 'Category 1', description: 'Description 1' },
      { name: 'Category 2', description: 'Description 2' },
      { name: 'Category 3', description: 'Description 3' },
      { name: 'Category 4', description: 'Description 4' },
      { name: 'Category 5', description: 'Description 5' },
    ];

    const findByNameCriteria = new FindByNameCriteria('Category 2');
    const filteredData = findByNameCriteria.applyCriteria(categoriesCollection);
    expect(filteredData[0]).toEqual({
      name: 'Category 2',
      description: 'Description 2',
    });
  });

  it('find by description', () => {
    const categoriesCollection = [
      { name: 'Category 1', description: 'Description 1' },
      { name: 'Category 2', description: 'Description 2' },
      { name: 'Category 3', description: 'Description 3' },
      { name: 'Category 4', description: 'Description 4' },
      { name: 'Category 5', description: 'Description 5' },
    ];

    const findByNameCriteria = new FindByDescriptionCriteria('Description 2');
    const filteredData = findByNameCriteria.applyCriteria(categoriesCollection);
    expect(filteredData[0]).toEqual({
      name: 'Category 2',
      description: 'Description 2',
    });
  });

  it('find by name and description', () => {
    const categoriesCollection = [
      { name: 'Category 1', description: 'Description 1' },
      { name: 'Category 2', description: 'Description 2' },
      { name: 'Category 3', description: 'Description 3' },
      { name: 'Category 4', description: 'Description 4' },
      { name: 'Category 5', description: 'Description 5' },
    ];

    let andCriteria = new AndCriteria([
      new FindByNameCriteria('Category 2'),
      new FindByDescriptionCriteria('Description 4'),
    ]);
    let filteredData = andCriteria.applyCriteria(categoriesCollection);
    expect(filteredData).toHaveLength(0);

    andCriteria = new AndCriteria([
      new FindByNameCriteria('Category 2'),
      new FindByDescriptionCriteria('Description 2'),
    ]);
    filteredData = andCriteria.applyCriteria(categoriesCollection);
    expect(filteredData).toEqual([
      {
        name: 'Category 2',
        description: 'Description 2',
      },
    ]);
  });

  it('find by name or description', () => {
    const categoriesCollection = [
      { name: 'Category 1', description: 'Description 1' },
      { name: 'Category 2', description: 'Description 2' },
      { name: 'Category 3', description: 'Description 3' },
      { name: 'Category 4', description: 'Description 4' },
      { name: 'Category 5', description: 'Description 5' },
    ];

    const orCriteria = new OrCriteria([
      new FindByNameCriteria('Category 2'),
      new FindByDescriptionCriteria('Description 4'),
    ]);
    const filteredData = orCriteria.applyCriteria(categoriesCollection);
    expect(filteredData).toHaveLength(2);
    expect(filteredData).toEqual([
      { name: 'Category 2', description: 'Description 2' },
      { name: 'Category 4', description: 'Description 4' },
    ]);
  });
});
