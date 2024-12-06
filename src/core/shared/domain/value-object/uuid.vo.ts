import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { ValueObject, ValueObjectError } from './value-object';

export class Uuid extends ValueObject {
  readonly id: string;

  constructor(id?: string) {
    super();
    this.id = id || uuidv4();
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.id);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }

  toString() {
    return this.id;
  }
}

export class InvalidUuidError extends ValueObjectError {
  constructor(message?: string) {
    super(message || 'ID must be a valida UUID', 'InvalidUuidError');
  }
}