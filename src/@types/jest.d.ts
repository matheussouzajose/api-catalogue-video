import { ValueObject } from '@core/shared/value-object/value-object';
import { FieldsErrors } from '@core/shared/domain/validator/validator-fields.interface';

declare global {
  namespace jest {
    interface Matchers<R> {
      //containsErrorMessages: (expected: FieldsErrors) => R;
      notificationContainsErrorMessages: (expected: Array<FieldsErrors>) => R;
      toBeValueObject: (expected: ValueObject) => R;
    }
  }
}
