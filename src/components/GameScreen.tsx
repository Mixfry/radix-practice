import React, { useState, useEffect } from "react";
import { InputField } from "./InputField";
import { Numpad } from "./Numpad"; 

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
  countdown: number | null;
  isTimeAttack: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  handleInputChange,
  handleKeyDown,
  handleAnswerSubmit,
  inputRefs,
  isBinaryInput,
  mode,
  countdown,
  isTimeAttack,
}) => {
  const isInputEmpty = userAnswers.every((answer) => answer.trim() === "");
  const [usingNumpad, setUsingNumpad] = useState(false);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.numpad-container')) {
        setUsingNumpad(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const getTargetBase = (mode: string) => {
    const targetSystem = mode.split("から")[1];
    
    if (targetSystem.includes("2進数")) return "2";
    if (targetSystem.includes("10進数")) return "10";
    if (targetSystem.includes("16進数")) return "16";
    
    return "n"; 
  };

  const handleNumpadPress = (value: string) => {
    if (countdown !== null) return;
    
    setUsingNumpad(true);
    
    let activeIndex = 0;
    const activeElement = document.activeElement;
    if (activeElement && inputRefs.current) {
      const activeIndexFound = inputRefs.current.findIndex(ref => ref === activeElement);
      if (activeIndexFound !== -1) {
        activeIndex = activeIndexFound;
      }
    }
    
    if (value === "delete") {
      const newAnswer = userAnswers[activeIndex].slice(0, -1);
      handleInputChange(newAnswer, activeIndex);
    } else if (value === "clear") {
      handleInputChange("", activeIndex);
    } else if (value === "answer") {
      if (!isInputEmpty) {
        handleAnswerSubmit();
      }
    } else {
      if (isBinaryInput && activeIndex < userAnswers.length) {
        const newAnswer = userAnswers[activeIndex] + value;
        handleInputChange(newAnswer, activeIndex);
      } else {
        const newAnswer = userAnswers[0] + value;
        handleInputChange(newAnswer, 0);
      }
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-6 p-8 bg-white rounded shadow-lg -mt-32">
        {isTimeAttack ? (
          <p className="text-lg">問題 {currentQuestionIndex + 1}問目</p>
        ) : (
          <p className="text-lg">問題 {currentQuestionIndex + 1}/{questions.length}</p>
        )}
        
        {countdown === null && questions && questions.length > 0 && currentQuestionIndex < questions.length ? (
          <p className="text-lg">{getTargetBase(mode)}進数に変換: {questions[currentQuestionIndex]?.question || ""}</p>
        ) : (
          <p className="text-lg">{getTargetBase(mode)}進数に変換: <span className="opacity-0">問題準備中...</span></p>
        )}
        
        <div className="flex gap-2">
          {isBinaryInput ? (
            userAnswers.map((answer, index) => (
              <InputField
                key={index}
                value={answer}
                index={index}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                isBinaryInput={true}
                ref={(el) => {
                  if (inputRefs.current) inputRefs.current[index] = el;
                }}
                disabled={countdown !== null}
                readOnly={usingNumpad} 
                onClick={() => setUsingNumpad(false)}
              />
            ))
          ) : (
            <input
              type="text"
              value={userAnswers[0]}
              onChange={(e) => handleInputChange(e.target.value, 0)}
              className="p-2 border rounded w-full"
              disabled={countdown !== null}
              readOnly={usingNumpad} 
              onClick={() => setUsingNumpad(false)}
              ref={(el) => {
                if (inputRefs.current) inputRefs.current[0] = el;
              }}
            />
          )}
        </div>
        
        <button
          onClick={handleAnswerSubmit}
          disabled={isInputEmpty || countdown !== null}
          className={`px-4 py-2 rounded text-white ${
            isInputEmpty || countdown !== null ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          回答
        </button>
        
        <Numpad 
          onPress={handleNumpadPress}
          mode={mode}
          countdown={countdown}
          isInputEmpty={isInputEmpty}
        />
      </div>
    </div>
  );
};