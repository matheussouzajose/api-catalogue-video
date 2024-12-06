import { Entity } from '@core/shared/domain/entity/entity';
import { IDomainEvent } from '@core/shared/domain/events/domain-event.interface';

export abstract class AggregateRoot extends Entity {
  events: Set<IDomainEvent> = new Set<IDomainEvent>();
  dispatchedEvents: Set<IDomainEvent> = new Set<IDomainEvent>();

  applyEvent(event: IDomainEvent) {
    this.events.add(event);
  }

  markEventAsDispatched(event: IDomainEvent) {
    this.dispatchedEvents.add(event);
  }

  getUncommittedEvents(): IDomainEvent[] {
    return Array.from(this.events).filter(
      (event) => !this.dispatchedEvents.has(event),
    );
  }

  clearEvents() {
    this.events.clear();
    // this.dispatchedEvents.clear()
  }
}
