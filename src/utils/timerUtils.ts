import { Dispatch, RefObject, SetStateAction } from "react";

//モーダル開いてる時はタイマーを止めるやつ
export const startTimer = (
  setElapsedTime: Dispatch<SetStateAction<number>>,
  timerRef: RefObject<NodeJS.Timeout | null>
) => {
  setElapsedTime(0);
  timerRef.current = setInterval(() => {
    setElapsedTime((prev) => prev + 100);
  }, 100);
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