import { ICriteria } from '@core/shared/domain/repository/criteria.interface';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';

export class FindByDescriptionCriteria implements ICriteria {
  constructor(private description: string) {}

  applyCriteria(query: QueryDslQueryContainer): QueryDslQueryContainer {
    return {
      ...query,
      bool: {
        ...query.bool,
        must: [
          ...(query.bool?.must
            ? typeof query.bool.must === 'object'
              ? [query.bool.must as QueryDslQueryContainer]
              : query.bool.must
            : []),
          {
            match: {
              category_description: this.description,
            },
          },
        ],
      },
    };
  }
}
