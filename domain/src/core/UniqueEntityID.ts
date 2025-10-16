import { randomUUID } from 'crypto';

export class UniqueEntityID {
  private value: string | number;

  toString() {
    return this.value.toString();
  }

  toValue() {
    return this.value;
  }

  constructor(value?: string | number) {
    this.value = value ?? randomUUID();
  }

  public equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }
}
