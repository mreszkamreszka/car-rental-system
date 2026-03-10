import { describe, it, expect } from 'vitest';
import {
  CarRentalSystem,
  CarType,
  CarTypeQuantities,
  type ReservationRequest,
} from '.';

describe('CarRentalSystem', () => {
  const createSystem = () => new CarRentalSystem(CarTypeQuantities);

  const makeRequest = (overrides?: Partial<ReservationRequest>): ReservationRequest => {
    const baseStart = new Date('2030-01-01T10:00:00Z');

    return {
      carType: CarType.Sedan,
      startDate: baseStart,
      days: 3,
      ...overrides,
    };
  };

  it('creates a reservation for a given car type, date and number of days', () => {
    const system = createSystem();

    const request = makeRequest();
    const reservation = system.reserve(request);

    expect(reservation).not.toBeNull();
    expect(reservation?.carType).toBe(request.carType);
    expect(reservation?.days).toBe(request.days);
    expect(reservation?.startDate.getTime()).toBe(request.startDate.getTime());
  });

  it('supports all 3 car types defined in CarType', () => {
    const system = createSystem();

    const types = [CarType.Sedan, CarType.SUV, CarType.Van];

    for (const type of types) {
      const request = makeRequest({ carType: type });
      const reservation = system.reserve(request);

      expect(reservation).not.toBeNull();
      expect(reservation?.carType).toBe(type);
    }
  });

  it('respects the limited number of cars per type for overlapping reservations', () => {
    const system = createSystem();
    const type = CarType.SUV;
    const totalForType = CarTypeQuantities[type];

    // All these reservations overlap fully in time.
    const overlappingRequest = makeRequest({ carType: type });

    const created = [];
    for (let index = 0; index < totalForType; index += 1) {
      const reservation = system.reserve(overlappingRequest);
      created.push(reservation);
    }

    // First N reservations succeed.
    expect(created.every((r) => r !== null)).toBe(true);

    // Next overlapping reservation for the same type should fail.
    const overLimitReservation = system.reserve(overlappingRequest);
    expect(overLimitReservation).toBeNull();
  });

  it('allows additional non-overlapping reservations for the same car type beyond the quantity limit', () => {
    const system = createSystem();
    const type = CarType.Van;
    const totalForType = CarTypeQuantities[type];

    // Fill all cars for a given time window with overlapping reservations.
    const overlappingRequest = makeRequest({ carType: type, days: 3 });
    for (let index = 0; index < totalForType; index += 1) {
      const reservation = system.reserve(overlappingRequest);
      expect(reservation).not.toBeNull();
    }

    // One more overlapping reservation for that same window should fail.
    const overLimitReservation = system.reserve(overlappingRequest);
    expect(overLimitReservation).toBeNull();

    // But a reservation starting after that window should succeed,
    // even though total number of reservations for this type is now > quantity.
    const nonOverlappingStart = new Date(overlappingRequest.startDate.getTime());
    nonOverlappingStart.setDate(nonOverlappingStart.getDate() + overlappingRequest.days);

    const nonOverlappingRequest = makeRequest({
      carType: type,
      startDate: nonOverlappingStart,
      days: 2,
    });

    const nonOverlappingReservation = system.reserve(nonOverlappingRequest);
    expect(nonOverlappingReservation).not.toBeNull();
    expect(nonOverlappingReservation?.carType).toBe(type);
  });
});

