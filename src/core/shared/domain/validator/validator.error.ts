import { FieldsErrors } from '@core/shared/domain/validator/validator-fields.interface';

export abstract class BaseValidationError extends Error {
  protected constructor(
    public error: FieldsErrors[],
    message = 'Validation Error',
  ) {
    super(message);
  }

  count() {
    return Object.keys(this.error).length;
  }
}

export class EntityValidationError extends BaseValidationError {
  constructor(public error: FieldsErrors[]) {
    super(error, 'Entity Validation Error');
    this.name = 'EntityValidationError';
  }
}

export class SearchValidationError extends BaseValidationError {
  constructor(error: FieldsErrors[]) {
    super(error, 'Search Validation Error');
    this.name = 'SearchValidationError';
  }
}

export class LoadEntityError extends BaseValidationError {
  constructor(public error: FieldsErrors[]) {
    super(error, 'LoadEntityError');
    this.name = 'LoadEntityError';
  }
}

export class ValidationError extends Error {
  private statusCode: number;
  private details?: any;

  constructor(
    message: string,
    name: string = 'ValidationException',
    statusCode = 409,
    details = null,
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
