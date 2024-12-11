import { ICriteria } from '@core/shared/domain/repository/criteria.interface';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';

export class AndCriteria implements ICriteria {
  private criterias: ICriteria[];

  constructor(criterias: ICriteria[]) {
    this.criterias = criterias;
  }

  applyCriteria(query: QueryDslQueryContainer): QueryDslQueryContainer {
    return this.criterias.reduce(
      (acc, criteria) => criteria.applyCriteria(acc),
      query,
    );
  }
}
