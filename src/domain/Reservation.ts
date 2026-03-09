import type { CarType } from './types';
import { Car } from './Car';

export class Reservation {
  readonly id: string;

  readonly car: Car;

  readonly carType: CarType;

  readonly startDate: Date;

  readonly days: number;

  constructor(
    id: string,
    car: Car,
    carType: CarType,
    startDate: Date,
    days: number,
  ) {
    this.id = id;
    this.car = car;
    this.carType = carType;
    this.startDate = startDate;
    this.days = days;
  }

  get endDate(): Date {
    const end = new Date(this.startDate.getTime());
    end.setDate(end.getDate() + this.days);
    return end;
  }
}


