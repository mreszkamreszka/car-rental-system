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

function validateCarType(value: CarType | ''): string | undefined {
    if (!value) {
        return 'Please select a car type.';
    }
    return undefined;
}

function validateStartDate(value: string): string | undefined {
    if (!value) {
        return 'Please choose a start date.';
    }
    return undefined;
}

function validateDays(value: string): string | undefined {
    const num = Number(value);
    if (!value || Number.isNaN(num) || num < 1) {
        return 'Number of days must be at least 1.';
    }
    if (num > 100) {
        return 'Number of days cannot exceed 100.';
    }
    return undefined;
}

function validateStartTime(dateValue: string, timeValue: string): string | undefined {
    if (!timeValue) {
        return 'Please choose a start time.';
    }
    if (!dateValue) {
        return undefined;
    }
    const selected = new Date(`${dateValue}T${timeValue}`);
    const nowLocal = new Date();
    if (selected.getTime() < nowLocal.getTime()) {
        return 'Start date and time cannot be in the past.';
    }
    return undefined;
}

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
        const carTypeErr = validateCarType(carType);
        if (carTypeErr) nextErrors.carType = carTypeErr;
        const startDateErr = validateStartDate(startDate);
        if (startDateErr) nextErrors.startDate = startDateErr;
        const startTimeErr = validateStartTime(startDate, startTime);
        if (startTimeErr) nextErrors.startTime = startTimeErr;
        const daysErr = validateDays(days);
        if (daysErr) nextErrors.days = daysErr;

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setSystemMessage(null);
            setIsSystemError(false);
            return;
        }

        setErrors({});

        const daysNumber = Number(days);
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
                    onChange={(next) => {
                        setCarType(next);
                        setErrors((prev) => ({
                            ...prev,
                            carType: validateCarType(next),
                        }));
                    }}
                />
                <StartDateTimeField
                    startDate={startDate}
                    startTime={startTime}
                    today={today}
                    minTime={minTime}
                    startDateError={errors.startDate}
                    startTimeError={errors.startTime}
                    onStartDateChange={(next) => {
                        setStartDate(next);
                        setErrors((prev) => ({
                            ...prev,
                            startDate: validateStartDate(next),
                            startTime: validateStartTime(next, startTime),
                        }));
                    }}
                    onStartTimeChange={(next) => {
                        setStartTime(next);
                        setErrors((prev) => ({
                            ...prev,
                            startTime: validateStartTime(startDate, next),
                        }));
                    }}
                />

                <DaysField
                    value={days}
                    error={errors.days}
                    onChange={(next) => {
                        setDays(next);
                        setErrors((prev) => ({
                            ...prev,
                            days: validateDays(next),
                        }));
                    }}
                />

                <button type="submit" className={styles.submitButton}>
                    Reserve
                </button>
            </form>
        </section>
    );
}
