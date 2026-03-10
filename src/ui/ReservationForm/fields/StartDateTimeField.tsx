import classNames from 'classnames';
import styles from './FormFields.module.scss';

type StartDateTimeFieldProps = {
  startDate: string;
  startTime: string;
  today: string;
  minTime: string | undefined;
  startDateError?: string;
  startTimeError?: string;
  onStartDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
};

export function StartDateTimeField({
  startDate,
  startTime,
  today,
  minTime,
  startDateError,
  startTimeError,
  onStartDateChange,
  onStartTimeChange,
}: StartDateTimeFieldProps) {
  const hasAnyError = Boolean(startDateError || startTimeError);

  return (
    <label className={styles.field} htmlFor="startDate">
      <span className={styles.label}>Start date &amp; time</span>
      <div className={styles.dateTimeRow}>
        <input
          id="startDate"
          type="date"
          min={today}
          className={classNames(styles.input, {
            [styles.inputError]: Boolean(startDateError),
          })}
          value={startDate}
          onChange={(event) => onStartDateChange(event.target.value)}
          required
          aria-required="true"
          aria-invalid={Boolean(startDateError)}
          aria-describedby={hasAnyError ? 'startDate-startTime-error' : undefined}
        />
        <input
          id="startTime"
          type="time"
          min={minTime}
          className={classNames(styles.input, {
            [styles.inputError]: Boolean(startTimeError),
          })}
          value={startTime}
          onChange={(event) => onStartTimeChange(event.target.value)}
          required
          aria-required="true"
          aria-invalid={Boolean(startTimeError)}
          aria-describedby={hasAnyError ? 'startDate-startTime-error' : undefined}
        />
      </div>
      {hasAnyError ? (
        <p
          id="startDate-startTime-error"
          className={styles.error}
          aria-live="polite"
        >
          {startDateError ? <span>{startDateError}</span> : null}
          {startTimeError ? <span>{startTimeError}</span> : null}
        </p>
      ) : null}
    </label>
  );
}

