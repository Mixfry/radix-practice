import { Dispatch, RefObject, SetStateAction } from "react";

export const startTimer = (setElapsedTime: React.Dispatch<React.SetStateAction<number>>, timerRef: React.MutableRefObject<NodeJS.Timeout | null>) => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }
  
  const startTime = Date.now();
  timerRef.current = setInterval(() => {
    const currentTime = Date.now();
    setElapsedTime(Math.floor((currentTime - startTime) / 10) * 10);
  }, 10);
};

export const stopTimer = (
  timerRef: RefObject<NodeJS.Timeout | null>
) => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
};

export const pauseTimer = (
  timerRef: RefObject<NodeJS.Timeout | null>,
  setIsTimerPaused: Dispatch<SetStateAction<boolean>>,
  elapsedTime: number,
  timerPausedAtRef: RefObject<number>
) => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIsTimerPaused(true);
    timerPausedAtRef.current = elapsedTime;
  }
};

export const resumeTimer = (
  isTimerPaused: boolean,
  timerRef: RefObject<NodeJS.Timeout | null>,
  setElapsedTime: Dispatch<SetStateAction<number>>,
  setIsTimerPaused: Dispatch<SetStateAction<boolean>>
) => {
  if (isTimerPaused) {
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 100);
    }, 100);
    setIsTimerPaused(false);
  }
};