import classNames from 'classnames';
import styles from './ReservationSystemMessage.module.scss';

type ReservationSystemMessageProps = {
  message: string | null;
  isError: boolean;
};

export function ReservationSystemMessage({
  message,
  isError,
}: ReservationSystemMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className={classNames({
        [styles.systemMessageError]: isError,
        [styles.systemMessage]: !isError,
      })}
      aria-live="polite"
    >
      {message}
    </p>
  );
}

