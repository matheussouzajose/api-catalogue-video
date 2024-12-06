import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import { DomainEventMediator } from '@core/shared/domain/events/domain-event-mediator';
import {
  IDomainEvent,
  IIntegrationEvent,
} from '@core/shared/domain/events/domain-event.interface';
import { Uuid } from '@core/shared/domain/value-object/uuid.vo';
import { ValueObject } from '@core/shared/domain/value-object/value-object';
import EventEmitter2 from 'eventemitter2';

class StubEvent implements IDomainEvent {
  aggregateId: ValueObject;
  occurredOn: Date;
  eventVersion: number;

  constructor(
    public aggregate_id: Uuid,
    public name: string,
  ) {
    this.occurredOn = new Date();
    this.eventVersion = 1;
  }

  getIntegrationEvent(): StubIntegrationEvent {
    return new StubIntegrationEvent(this);
  }
}

class StubIntegrationEvent implements IIntegrationEvent {
  eventVersion: number;
  occurredOn: Date;
  eventName: string;
  payload: any;
  constructor(event: StubEvent) {
    this.occurredOn = event.occurredOn;
    this.eventVersion = event.eventVersion;
    this.eventName = this.constructor.name;
    this.payload = event;
  }
}

class StubAggregate extends AggregateRoot {
  id: Uuid;
  name: string;

  action(name: string) {
    this.name = name;
    this.applyEvent(new StubEvent(this.id, this.name));
  }

  get entityId(): ValueObject {
    return this.id;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      name: this.name,
    };
  }
}

describe('DomainEventMediator Unit Tests', () => {
  let mediator: DomainEventMediator;

  beforeEach(() => {
    const eventEmitter = new EventEmitter2();
    mediator = new DomainEventMediator(eventEmitter);
  });

  test('Should publish handler', async () => {
    expect.assertions(1);
    mediator.register(StubEvent.name, async (event: StubEvent) => {
      expect(event.name).toBe('test');
    });

    const aggregate = new StubAggregate({
      entityId: new Uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    aggregate.action('test');
    await mediator.publish(aggregate);
    await mediator.publish(aggregate);
  });

  test('Should not publish an integration event', () => {
    expect.assertions(1);
    const spyEmitAsync = jest.spyOn(mediator['eventEmitter'], 'emitAsync');

    const aggregate = new StubAggregate({
      entityId: new Uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    aggregate.action('test');
    Array.from(aggregate.events)[0].getIntegrationEvent = undefined;
    mediator.publishIntegrationEvents(aggregate);
    expect(spyEmitAsync).not.toBeCalled();
  });

  test('Should publish integration event', async () => {
    expect.assertions(4);
    mediator.register(
      StubIntegrationEvent.name,
      async (event: StubIntegrationEvent) => {
        expect(event.eventName).toBe(StubIntegrationEvent.name);
        expect(event.eventVersion).toBe(1);
        expect(event.occurredOn).toBeInstanceOf(Date);
        expect(event.payload.name).toBe('test');
      },
    );

    const aggregate = new StubAggregate({
      entityId: new Uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    aggregate.action('test');
    await mediator.publishIntegrationEvents(aggregate);
  });
});
