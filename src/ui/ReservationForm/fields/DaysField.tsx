import classNames from 'classnames';
import styles from './FormFields.module.scss';

type DaysFieldProps = {
  value: string;
  error?: string;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
};

export function DaysField({ value, error, min = 1, max = 100, onChange }: DaysFieldProps) {
  return (
    <label className={styles.field} htmlFor="days">
      <span className={styles.label}>Days</span>
      <input
        id="days"
        type="number"
        min={min}
        max={max}
        className={classNames(styles.input, {
          [styles.inputError]: Boolean(error),
        })}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        aria-required="true"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'days-error' : undefined}
      />
      {error ? (
        <p id="days-error" className={styles.error} aria-live="polite">
          {error}
        </p>
      ) : null}
    </label>
  );
}

