import { ValueObject } from '@core/shared/domain/value-object/value-object';

export interface IDomainEvent {
  aggregateId: ValueObject;
  occurredOn: Date;
  eventVersion: number;

  getIntegrationEvent?(): IIntegrationEvent;
}

export interface IIntegrationEvent<T = any> {
  eventVersion: number;
  occurredOn: Date;
  payload: T;
  eventName: string;
}
