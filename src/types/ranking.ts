export type RankingItem = {
  name: string;
  score: number;
  mode: string;
  difficulty: string;
  time: number;
  date: string;
  correctAnswers: number; 
  totalQuestions: number; 
};

export interface RankingDBItem {
  name: string;
  score: number;
  mode: string;
  difficulty: string;
  time: number;
  created_at: string; 
  correct_answers: number;
  total_questions: number;
}