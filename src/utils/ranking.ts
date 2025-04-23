import { RankingItem, RankingDBItem } from "../types/ranking";

export const getRankingData = async (): Promise<RankingItem[]> => {
  try {
    const response = await fetch('/api/rankings');
    const result = await response.json();
    
    if (!result.success) {
      console.error("ランキング取得エラー:", result.error);
      return [];
    }
    
    const rankingData = result.data.map((item: RankingDBItem) => ({
      name: item.name,
      score: item.score,
      mode: item.mode,
      difficulty: item.difficulty,
      time: item.time,
      date: item.created_at,
      correctAnswers: item.correct_answers,
      totalQuestions: item.total_questions
    }));
    
    return rankingData;
  } catch (error) {
    console.error("ランキング取得エラー:", error);
    return [];
  }
};

export const saveToRanking = async (
  playerName: string,
  score: number,
  mode: string,
  difficulty: string,
  time: number,
  correctAnswers: number,
  totalQuestions: number
): Promise<{ success: boolean; message: string }> => {
  if (!playerName.trim()) {
    throw new Error("名前を入力してください");
  }

  try {
    const response = await fetch('/api/rankings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playerName,
        score,
        mode,
        difficulty,
        time,
        correctAnswers,
        totalQuestions
      }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || result.error);
    }
    
    return result;
  } catch (error) {
    console.error("ランキング保存エラー:", error);
    throw error;
  }
};

export const handleRankingRegistration = async (
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
): Promise<boolean> => {
  try {
    const result = await saveToRanking(
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
    
    alert(result.message);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
    return false;
  }
};