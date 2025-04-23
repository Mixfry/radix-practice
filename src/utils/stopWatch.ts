import { RefObject, } from "react";

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

//　タイムアタック用
export const startTimerCountdown = (
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>, 
  timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  onTimeUp: () => void
) => {
  if (timerRef.current) {
    clearInterval(timerRef.current);
  }
  
  timerRef.current = setInterval(() => {
    setElapsedTime((prev) => {
      if (prev <= 100) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        onTimeUp();
        return 0;
      }
      return prev - 100;
    });
  }, 100);
};