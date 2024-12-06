import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import EventEmitter2 from 'eventemitter2';

export class DomainEventMediator {
  constructor(private eventEmitter: EventEmitter2) {}

  register(event: string, handler: any) {
    this.eventEmitter.on(event, handler);
  }

  async publish(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.getUncommittedEvents()) {
      const eventClassName = event.constructor.name;
      aggregateRoot.markEventAsDispatched(event);
      await this.eventEmitter.emitAsync(eventClassName, event);
    }
  }

  async publishIntegrationEvents(aggregateRoot: AggregateRoot) {
    for (const event of aggregateRoot.events) {
      const integrationEvent = event.getIntegrationEvent?.();
      if (!integrationEvent) continue;
      aggregateRoot.clearEvents();
      await this.eventEmitter.emitAsync(
        integrationEvent.constructor.name,
        integrationEvent,
      );
    }
  }
}
