import { useState } from 'react';
import type React from 'react';
import { CarType, defaultCarRentalSystem, type ReservationRequest } from '../domain';
import styles from './ReservationForm.module.scss';
import { ReservationSystemMessage } from './ReservationSystemMessage/ReservationSystemMessage';
import { CarTypeField } from './ReservationForm/fields/CarTypeField';
import { StartDateTimeField } from './ReservationForm/fields/StartDateTimeField';
import { DaysField } from './ReservationForm/fields/DaysField';
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
    const [isSystemError, setIsSystemError] = useState(false);

    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const minTime =
        startDate === today
            ? `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
            : undefined;

    const carTypeOptions = Object.entries(CarType) as Array<[string, CarType]>;

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
        } else if (daysNumber > 100) {
            nextErrors.days = 'Number of days cannot exceed 100.';
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
            setIsSystemError(false);
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
            setIsSystemError(true);
            return;
        }

        console.log('Reservation created:', reservation);
        const startTimeStr = reservation.startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        setSystemMessage(
            `Reserved ${reservation.car.type} (${reservation.car.id}) from ${reservation.startDate.toDateString()} at ${startTimeStr} for ${reservation.days} day(s).`
        );
        setIsSystemError(false);
    };

    return (
        <section className={styles.container}>
            <h1 className={styles.title}>Rent a car</h1>
            <ReservationSystemMessage message={systemMessage} isError={isSystemError} />
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <CarTypeField
                    value={carType}
                    options={carTypeOptions}
                    error={errors.carType}
                    onChange={setCarType}
                />
                <StartDateTimeField
                    startDate={startDate}
                    startTime={startTime}
                    today={today}
                    minTime={minTime}
                    startDateError={errors.startDate}
                    startTimeError={errors.startTime}
                    onStartDateChange={setStartDate}
                    onStartTimeChange={setStartTime}
                />

                <DaysField value={days} error={errors.days} onChange={setDays} />

                <button type="submit" className={styles.submitButton}>
                    Reserve
                </button>
            </form>
        </section>
    );
}
