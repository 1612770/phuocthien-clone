import { useEffect, useState } from 'react';

export function useDebounce<T = unknown>(value: T, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useCountdown({
  initialCountdown = 120,
}: {
  initialCountdown: number;
}) {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    setCountdown(initialCountdown);
  }, [initialCountdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countdown >= 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);

        if (countdown < 0) {
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  return { countdown };
}
