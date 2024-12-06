import { CategoryFakeBuilder } from '@core/category/domain/entity/category-fake.builder';
import { CategoryValidatorFactory } from '@core/category/domain/validator/category.validator.factory';
import { AggregateRoot } from '@core/shared/domain/entity/aggregate-root';
import { EntityProps } from '@core/shared/domain/entity/entity';
import { Uuid } from '@core/shared/domain/value-object/uuid.vo';

export class CategoryId extends Uuid {}

export type CategoryProps = EntityProps & {
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export type CategoryCreate = Omit<CategoryProps, keyof EntityProps>;

export class CategoryAggregate extends AggregateRoot {
  protected _name: string;
  protected _description: string;
  protected _isActive: boolean;

  constructor(props: CategoryProps) {
    super(props);

    this._name = props.name;
    this._description = props.description;
    this._isActive = props.isActive;

    this.validate();
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static create(props: CategoryCreate) {
    return new CategoryAggregate({
      entityId: new CategoryId(),
      name: props.name,
      description: props.description ?? null,
      isActive: props.isActive ?? true,
    });
  }

  get entityId(): CategoryId {
    return this._entityId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  changeName(name: string) {
    this._name = name;
    this.validate(['_name']);
    this.markAsUpdated();
  }

  changeDescription(description: string) {
    this._description = description;
    // this.markAsUpdated();
  }

  activate() {
    this._isActive = true;
    // this.markAsUpdated();
  }

  deactivate() {
    this._isActive = false;
    this.markAsUpdated();
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  toJSON() {
    return {
      category_id: this.entityId.id,
      name: this._name,
      description: this._description,
      is_active: this._isActive,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      deleted_at: this.deletedAt,
    };
  }
}
