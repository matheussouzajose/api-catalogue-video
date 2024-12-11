interface ICriteria {
  applyCriteria(data: any[]): any[];
}

export class FindByNameCriteria implements ICriteria {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  applyCriteria(data: any[]): any[] {
    return data.filter((item) => item.name === this.name);
  }
}

export class FindByDescriptionCriteria implements ICriteria {
  private description: string;

  constructor(description: string) {
    this.description = description;
  }

  applyCriteria(data: any[]): any[] {
    return data.filter((item) => item.description === this.description);
  }
}

export class AndCriteria implements ICriteria {
  private criterias: ICriteria[];

  constructor(criterias: ICriteria[]) {
    this.criterias = criterias;
  }

  applyCriteria(data: any[]): any[] {
    const filteredData = new Array<any[]>();

    this.criterias.forEach((criteria) => {
      filteredData.push(criteria.applyCriteria(data) as any[]);
    });

    //check if the data is in all the arrays
    return filteredData.reduce((acc, current) => {
      return acc.filter((item) => current.includes(item));
    });
  }
}

export class OrCriteria implements ICriteria {
  private criterias: ICriteria[];

  constructor(criterias: ICriteria[]) {
    this.criterias = criterias;
  }

  applyCriteria(data: any[]): any[] {
    const filteredData = new Array<any[]>();

    this.criterias.forEach((criteria) => {
      filteredData.push(criteria.applyCriteria(data) as any[]);
    });

    //check if the data is in any of the arrays and remove duplicates
    return filteredData.reduce((acc, current) => {
      return [...new Set([...acc, ...current])];
    });
  }
}
