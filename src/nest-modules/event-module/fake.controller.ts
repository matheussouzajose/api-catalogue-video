import { Controller, Get } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('fake-event')
export class FakeController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Get()
  dispatchEvent() {
    this.eventEmitter.emit('test', { data: 'dados dos eventos' });
    return { ok: true };
  }
}
