import type { CarType } from './types';

export class Car {
  readonly id: string;

  readonly type: CarType;

  constructor(id: string, type: CarType) {
    this.id = id;
    this.type = type;
  }
}


