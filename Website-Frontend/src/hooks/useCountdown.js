import { useState, useEffect } from 'react';

export const useCountdown = (waitTime) => {
  const [timeLeft, setTimeLeft] = useState(waitTime || 0);

  useEffect(() => {
    if (waitTime !== null && waitTime !== undefined) {
      setTimeLeft(waitTime); // Set the initial time
    }
  }, [waitTime]);

  useEffect(() => {
    if (timeLeft <= 0) return; // Stop when countdown hits 0

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(interval); // Stop interval when 0
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return { timeLeft, startCountdown: () => setTimeLeft(waitTime), stopCountdown: () => setTimeLeft(0) };
};