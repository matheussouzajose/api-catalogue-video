import { Notification } from '@core/shared/domain/validator/notification';
import { ValueObject } from '@core/shared/domain/value-object/value-object';
import { Uuid } from '../value-object/uuid.vo';

export type EntityProps = {
  entityId: Uuid;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export abstract class Entity {
  protected readonly _entityId: Uuid;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _deletedAt: Date | null;

  constructor(props: EntityProps) {
    this._entityId = props.entityId;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._deletedAt = props.deletedAt ?? null;
  }
  notification: Notification = new Notification();

  abstract get entityId(): ValueObject;

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  markAsDeleted(): void {
    this._deletedAt = new Date();
  }

  markAsUpdated(): void {
    this._updatedAt = new Date();
  }

  changeCreatedAt(createdAt: Date): void {
    this._createdAt = createdAt;
  }

  abstract toJSON(): any;
}
