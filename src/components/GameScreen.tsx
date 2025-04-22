interface GameScreenProps {
  questions: { question: string; answer: string }[];
  currentQuestionIndex: number;
  userAnswers: string[];
  handleInputChange: (value: string, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  handleAnswerSubmit: () => void;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  isBinaryInput: boolean;
  feedback: string | null;
  mode: string; 
}

export const GameScreen = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  handleInputChange,
  handleKeyDown,
  handleAnswerSubmit,
  inputRefs,
  isBinaryInput,
  mode,
}: GameScreenProps) => {
  const isInputEmpty = userAnswers.every((answer) => answer.trim() === "");

  const getTargetBase = (mode: string) => {
    const targetSystem = mode.split("から")[1];
    
    if (targetSystem.includes("2進数")) return "2";
    if (targetSystem.includes("10進数")) return "10";
    if (targetSystem.includes("16進数")) return "16";
    
    return "n"; 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-8 p-8 bg-white rounded shadow-lg -mt-32">
        <p className="text-lg">
          問題 {currentQuestionIndex + 1}/{questions.length}
        </p>
        <p className="text-lg">{getTargetBase(mode)}進数に変換: {questions[currentQuestionIndex].question}</p>
        <div className="flex gap-2">
          {isBinaryInput ? (
            userAnswers.map((answer, index) => (
              <input
                key={index}
                type="text"
                value={answer}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="p-2 border rounded w-16 text-center"
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                maxLength={4}
              />
            ))
          ) : (
            <input
              type="text"
              value={userAnswers[0]}
              onChange={(e) => handleInputChange(e.target.value, 0)}
              className="p-2 border rounded w-full"
            />
          )}
        </div>
        <button
          onClick={handleAnswerSubmit}
          disabled={isInputEmpty} 
          className={`px-4 py-2 rounded text-white ${
            isInputEmpty ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          回答
        </button>
      </div>
    </div>
  );
};