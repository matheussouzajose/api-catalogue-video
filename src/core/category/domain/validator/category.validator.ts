import { Notification } from '@core/shared/domain/validator/notification';
import { ClassValidatorFields } from '@core/shared/domain/validator/class-validator-fields';

import { CategoryAggregate } from '@core/category/domain/entity/category.aggregate';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CategoryRules {
  @IsNotEmpty({ groups: ['_name'] })
  @MaxLength(255, { groups: ['_name'] })
  _name: string;

  constructor(entity: CategoryAggregate) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['_name'];
    return super.validate(notification, new CategoryRules(data), newFields);
  }
}
