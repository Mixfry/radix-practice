import { formatBinary } from "./format";

const modeHandlers: Record<
  string,
  (randomNumber: number) => { question: string; answer: string }
> = {
  "2進数から10進数": (randomNumber) => ({
    question: formatBinary(randomNumber.toString(2)),
    answer: randomNumber.toString(10),
  }),
  "10進数から2進数": (randomNumber) => ({
    question: randomNumber.toString(10),
    answer: formatBinary(randomNumber.toString(2)),
  }),
  "10進数から16進数": (randomNumber) => ({
    question: randomNumber.toString(10),
    answer: randomNumber.toString(16),
  }),
  "16進数から2進数": (randomNumber) => ({
    question: randomNumber.toString(16),
    answer: formatBinary(parseInt(randomNumber.toString(16), 16).toString(2)),
  }),
  "16進数から10進数": (randomNumber) => ({
    question: randomNumber.toString(16),
    answer: parseInt(randomNumber.toString(16), 16).toString(10),
  }),
};

export const generateQuestions = (mode: string, questionCount: string, difficulty: string) => {
  const count = questionCount === "free" ? 10 : parseInt(questionCount, 10);

  /*
  * 難易度に応じて出題される数字の数が大きくなる!
  * 初級: ~15, 1111
  * 中級: ~255, 1111 1111
  * 上級: ~4095, 1111 1111 1111
  */
  const maxNumber = difficulty === "beginner" 
    ? 15 
    : difficulty === "intermediate" 
    ? 255 
    : 4095; 

  return Array.from({ length: count }, () => {
    const randomNumber = Math.floor(Math.random() * (maxNumber + 1)); 
    return modeHandlers[mode](randomNumber);
  });
};

export const handleInputChange = (
  value: string,
  index: number,
  userAnswers: string[],
  setUserAnswers: React.Dispatch<React.SetStateAction<string[]>>,
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>,
  isBinaryInput: boolean
) => {
  const updatedAnswers = [...userAnswers];
  updatedAnswers[index] = isBinaryInput ? value.slice(0, 4) : value;
  setUserAnswers(updatedAnswers);

  if (isBinaryInput && value.length === 4 && index === userAnswers.length - 1 && userAnswers.length < 3) {
    setUserAnswers([...updatedAnswers, ""]);
    setTimeout(() => {
      inputRefs.current[index + 1]?.focus();
    }, 0);
  }
};

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number,
  userAnswers: string[],
  setUserAnswers: React.Dispatch<React.SetStateAction<string[]>>,
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>,
  isBinaryInput: boolean,
) => {
  if (isBinaryInput && e.key === "Backspace") {
    const updatedAnswers = [...userAnswers];
    if (updatedAnswers[index] === "" && index > 0) {
      updatedAnswers.splice(index, 1);
      setUserAnswers(updatedAnswers);
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 0);
    }
  }
};

export const formatBinaryAnswer = (binary: string): string => {
  // 2進数を読みやすくするために4桁ごとに空白を入れてる
  return binary.replace(/(.{4})/g, "$1 ").trim();
};

export const generateExplanation = (question: string, correctAnswer: string, mode: string): string => {
  let base = 10;
  if (mode.includes("2進数")) base = 2;
  if (mode.includes("16進数")) base = 16;

  const cleanQuestion = question.replace(/\s/g, "");
  
  if (mode === "2進数から10進数") {
    const weights = [...cleanQuestion]
      .reverse()
      .map((digit, index) => ({ 
        digit, 
        value: parseInt(digit, base) * Math.pow(base, index) 
      }))
      .reverse();
    
    // 途中式の作成したかったんだけどなんか動かない、後で直す
    const calculation = weights
      .filter(item => item.value > 0) // 0の項は表示しない（見やすさのため）
      .map(item => {
        const power = Math.log(item.value / parseInt(item.digit, base)) / Math.log(base);
        if (power === 0) return item.digit;
        return `${item.digit}×${base}^${power}=${item.value}`;
      })
      .join(" + ");
    
    return `${question}は ${calculation} となるので ${correctAnswer} でした！`;
  }

  // 「〇〇から2進数」の場合は4桁ごとに空白を挿入するように
  if (mode.includes("から2進数")) {
    const formattedAnswer = formatBinaryAnswer(correctAnswer);
    return `${question}は${formattedAnswer}でした！`;
  }
  
  return `${question}は${correctAnswer}でした！`;
};