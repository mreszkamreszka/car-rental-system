import { Car } from './Car';
import { Reservation } from './Reservation';
import {
  CarType,
  type ReservationRequest,
  CarTypeQuantities,
  type CarTypeQuantities as InventoryConfig,
} from './types';

export class CarRentalSystem {
  private readonly carsByType: Map<CarType, Car[]> = new Map();
  private readonly reservations: Reservation[] = [];

  constructor(config: InventoryConfig) {
    Object.values(CarType).forEach((type) => {
      const count = config[type as CarType] ?? 0;
      const cars: Car[] = [];

      for (let index = 0; index < count; index += 1) {
        cars.push(new Car(`${type}-${index + 1}`, type as CarType));
      }

      this.carsByType.set(type as CarType, cars);
    });
  }

  static createDefault(): CarRentalSystem {
    return new CarRentalSystem(CarTypeQuantities);
  }

  getAvailableCars(type: CarType, startDate: Date, days: number): Car[] {
    const cars = this.carsByType.get(type) ?? [];

    return cars.filter((car) => this.isCarAvailable(car, startDate, days));
  }

  reserve(request: ReservationRequest): Reservation | null {
    const availableCars = this.getAvailableCars(
      request.carType,
      request.startDate,
      request.days,
    );

    const car = availableCars[0];

    if (!car) {
      return null;
    }

    const reservation = new Reservation(
      `${request.carType}-${Date.now()}`,
      car,
      request.carType,
      request.startDate,
      request.days,
    );

    this.reservations.push(reservation);

    return reservation;
  }

  private isCarAvailable(car: Car, startDate: Date, days: number): boolean {
    const endDate = this.calculateEndDate(startDate, days);

    const reservationsForCar = this.reservations.filter(
      (reservation) => reservation.car.id === car.id,
    );

    return reservationsForCar.every((reservation) => {
      const otherStart = reservation.startDate;
      const otherEnd = reservation.endDate;

      // Check for non-overlapping intervals: [start, end)
      return endDate <= otherStart || startDate >= otherEnd;
    });
  }

  private calculateEndDate(startDate: Date, days: number): Date {
    const end = new Date(startDate.getTime());
    end.setDate(end.getDate() + days);
    return end;
  }
}

export const defaultCarRentalSystem = CarRentalSystem.createDefault();

