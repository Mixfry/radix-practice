export const calculateScore = (
  score: number,
  totalQuestions: number,
  elapsedTime: number,
  difficultyLevel: string,
  difficultyLevels: string[]
): number => {
  const correctRatio = score / totalQuestions;
  
  let difficultyFactor = 1;
  if (difficultyLevel === difficultyLevels[1]) {
    difficultyFactor = 2; // 中級は2倍
  } else if (difficultyLevel === difficultyLevels[2]) {
    difficultyFactor = 3; // 上級は3倍
  }
  
  let timeRatio;
  
  if (elapsedTime <= 10000) {
    timeRatio = 1.0;
  } else if (elapsedTime <= 90000) {
    const timeRange = 90000 - 10000;
    const elapsed = elapsedTime - 10000;
    timeRatio = 1.0 - (0.5 * elapsed) / (timeRange * difficultyFactor);
  } else {
    const baseRatio = 0.5 / difficultyFactor; 
    const slowFactor = 5; // 基準の90秒をすぎると5倍遅くなる！優しいね
    const additionalElapsed = elapsedTime - 90000;
    
    timeRatio = baseRatio - (additionalElapsed / (80000 * difficultyFactor * slowFactor));
  }
  
  timeRatio = Math.max(0, timeRatio);
  
  const calculatedScore = Math.round(correctRatio * timeRatio * 1000 * difficultyFactor);
  return calculatedScore;
};