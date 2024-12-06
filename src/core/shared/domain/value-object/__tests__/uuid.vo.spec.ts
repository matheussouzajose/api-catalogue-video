import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-object/uuid.vo';
import { validate as uuidValidate } from 'uuid';

describe('Uuid Unit Tests', () => {
  test('Should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrow(new InvalidUuidError());
  });

  test('Should create a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
  });

  test('Should accept a valid uuid', () => {
    const uuid = new Uuid('c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c');
    expect(uuid.id).toBe('c3e9b0d0-7b6f-4a8e-8e1f-3f9e6a2f7e3c');
  });
});
