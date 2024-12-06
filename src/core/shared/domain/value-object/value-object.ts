import { isEqual } from 'lodash';

export abstract class ValueObject {
  public equals(vo: this): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }
    return isEqual(vo, this);
  }
}

export class ValueObjectError extends Error {
  private readonly statusCode: number;
  constructor(message: string, name: string, statusCode = 404) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
