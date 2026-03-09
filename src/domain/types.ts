export const CarType = {
  Sedan: 'SEDAN',
  SUV: 'SUV',
  Van: 'VAN',
} as const;

export type CarType = (typeof CarType)[keyof typeof CarType];

export interface ReservationRequest {
  carType: CarType;
  startDate: Date;
  days: number;
}

export const CarTypeQuantities = {
  [CarType.Sedan]: 5,
  [CarType.SUV]: 3,
  [CarType.Van]: 2,
} as const;

export type CarTypeQuantities = typeof CarTypeQuantities;

