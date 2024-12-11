import { ICriteria } from '@core/shared/domain/repository/criteria.interface';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';

export class FindByNameCriteria implements ICriteria {
  constructor(private name: string) {}

  applyCriteria(query: QueryDslQueryContainer): QueryDslQueryContainer {
    return {
      ...query,
      bool: {
        ...query.bool,
        must: [
          ...(query.bool?.must
            ? Array.isArray(query.bool.must)
              ? query.bool.must
              : [query.bool.must as QueryDslQueryContainer]
            : []),
          {
            match: {
              category_name: this.name,
            },
          },
        ],
      },
    };
  }
}
