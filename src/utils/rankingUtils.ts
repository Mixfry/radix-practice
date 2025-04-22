import { RankingItem } from "../types/ranking";

export const getRankingData = (): RankingItem[] => {
  const rankingData = JSON.parse(localStorage.getItem("rankingData") || "[]") as RankingItem[];
  return rankingData;
};

export const saveToRanking = (
  playerName: string,
  score: number,
  mode: string,
  difficulty: string,
  time: number,
  correctAnswers: number,
  totalQuestions: number
): void => {
  if (!playerName.trim()) {
    throw new Error("名前を入力してください");
  }

  const rankingData = getRankingData();
  
  rankingData.push({
    name: playerName,
    score,
    mode,
    difficulty,
    time,
    date: new Date().toISOString(),
    correctAnswers,
    totalQuestions
  });
  
  rankingData.sort((a: RankingItem, b: RankingItem) => b.score - a.score);
  
  const topRankings = rankingData.slice(0, 10);
  
  localStorage.setItem("rankingData", JSON.stringify(topRankings));
};

export const handleRankingRegistration = (
  playerName: string,
  score: number,
  mode: string,
  difficultyLevel: string,
  elapsedTime: number,
  correctAnswers: number,
  totalQuestions: number,
  setIsNameInputModalOpen: (isOpen: boolean) => void,
  setIsResultModalOpen: (isOpen: boolean) => void,
  setGameStarted: (isStarted: boolean) => void,
  setPlayerName: (name: string) => void
) => {
  try {
    saveToRanking(
      playerName,
      score,
      mode,
      difficultyLevel,
      elapsedTime,
      correctAnswers,
      totalQuestions
    );
    
    setIsNameInputModalOpen(false);
    setIsResultModalOpen(false);
    setGameStarted(false);
    
    setPlayerName("");
    
    alert("ランキングに登録しました！");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
    return false;
  }
};