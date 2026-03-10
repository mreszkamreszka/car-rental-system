import classNames from 'classnames';
import type { CarType } from '../../../domain';
import styles from './FormFields.module.scss';

type CarTypeFieldProps = {
    value: CarType | '';
    options: Array<[string, CarType]>;
    error?: string;
    onChange: (value: CarType | '') => void;
};

export function CarTypeField({ value, options, error, onChange }: CarTypeFieldProps) {
    return (
        <label className={styles.field} htmlFor="carType">
            <span className={styles.label}>Car type</span>
            <select
                id="carType"
                className={classNames(styles.select, {
                    [styles.inputError]: Boolean(error),
                })}
                value={value}
                onChange={(event) => onChange(event.target.value as CarType | '')}
                required
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'carType-error' : undefined}
            >
                <option value="" disabled>
                    Select car type
                </option>
                {options.map(([label, optionValue]) => (
                    <option key={optionValue} value={optionValue}>
                        {label}
                    </option>
                ))}
            </select>
            {error ? (
                <p id="carType-error" className={styles.error} aria-live="polite">
                    {error}
                </p>
            ) : null}
        </label>
    );
}
