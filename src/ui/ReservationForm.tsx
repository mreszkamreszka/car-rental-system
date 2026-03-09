import { useState } from 'react';
import type React from 'react';
import {
  CarType,
  defaultCarRentalSystem,
  type ReservationRequest,
} from '../domain';
import styles from './ReservationForm.module.scss';

type Errors = {
  carType?: string;
  startDate?: string;
  startTime?: string;
  days?: string;
};

export function ReservationForm() {
  const [carType, setCarType] = useState<CarType | ''>('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [days, setDays] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const nextErrors: Errors = {};

    if (!carType) {
      nextErrors.carType = 'Please select a car type.';
    }

    if (!startDate) {
      nextErrors.startDate = 'Please choose a start date.';
    }

    if (!startTime) {
      nextErrors.startTime = 'Please choose a start time.';
    }

    const daysNumber = Number(days);
    if (!days || Number.isNaN(daysNumber) || daysNumber < 1) {
      nextErrors.days = 'Number of days must be at least 1.';
    }

    // Validate that selected start date & time is not in the past
    if (startDate && startTime) {
      const selected = new Date(`${startDate}T${startTime}`);
      const now = new Date();

      if (selected.getTime() < now.getTime()) {
        nextErrors.startTime = 'Start date and time cannot be in the past.';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSystemMessage(null);
      return;
    }

    setErrors({});

    const startDateTime = new Date(`${startDate}T${startTime}`);

    const request: ReservationRequest = {
      carType: carType as CarType,
      startDate: startDateTime,
      days: daysNumber,
    };

    const reservation = defaultCarRentalSystem.reserve(request);

    if (!reservation) {
      setSystemMessage('No cars of this type are available for the selected dates.');
      return;
    }

    console.log('Reservation created:', reservation);
    setSystemMessage(
      `Reserved ${reservation.car.type} (${reservation.car.id}) from ${reservation.startDate.toDateString()} for ${reservation.days} day(s).`,
    );
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Rent a car</h1>
      {systemMessage ? (
        <p
          className={
            systemMessage.startsWith('No cars')
              ? styles.systemMessageError
              : styles.systemMessage
          }
          aria-live="polite"
        >
          {systemMessage}
        </p>
      ) : null}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field} htmlFor="carType">
          <span className={styles.label}>Car type</span>
          <select
            id="carType"
            className={`${styles.select} ${errors.carType ? styles.inputError : ''}`}
            value={carType}
            onChange={(event) => setCarType(event.target.value as CarType | '')}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.carType)}
            aria-describedby={errors.carType ? 'carType-error' : undefined}
          >
            <option value="">Select car type</option>
            <option value={CarType.Sedan}>Sedan</option>
            <option value={CarType.SUV}>SUV</option>
            <option value={CarType.Van}>Van</option>
          </select>
          {errors.carType ? (
            <p id="carType-error" className={styles.error} aria-live="polite">
              {errors.carType}
            </p>
          ) : null}
        </label>

        <label className={styles.field} htmlFor="startDate">
          <span className={styles.label}>Start date &amp; time</span>
          <div className={styles.dateTimeRow}>
            <input
              id="startDate"
              type="date"
              className={`${styles.input} ${errors.startDate ? styles.inputError : ''}`}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.startDate)}
              aria-describedby={errors.startDate ? 'startDate-error' : undefined}
            />
            <input
              id="startTime"
              type="time"
              className={`${styles.input} ${errors.startTime ? styles.inputError : ''}`}
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.startTime)}
              aria-describedby={errors.startTime ? 'startTime-error' : undefined}
            />
          </div>
          {errors.startDate ? (
            <p id="startDate-error" className={styles.error} aria-live="polite">
              {errors.startDate}
            </p>
          ) : null}
          {errors.startTime ? (
            <p id="startTime-error" className={styles.error} aria-live="polite">
              {errors.startTime}
            </p>
          ) : null}
        </label>

        <label className={styles.field} htmlFor="days">
          <span className={styles.label}>Days</span>
          <input
            id="days"
            type="number"
            min="1"
            className={`${styles.input} ${errors.days ? styles.inputError : ''}`}
            value={days}
            onChange={(event) => setDays(event.target.value)}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.days)}
            aria-describedby={errors.days ? 'days-error' : undefined}
          />
          {errors.days ? (
            <p id="days-error" className={styles.error} aria-live="polite">
              {errors.days}
            </p>
          ) : null}
        </label>

        <button type="submit" className={styles.submitButton}>
          Reserve
        </button>
      </form>
    </section>
  );
}
