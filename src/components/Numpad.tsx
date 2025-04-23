import React from "react";

interface NumpadProps {
  onPress: (value: string) => void;
  mode: string;
  countdown: number | null;
  isInputEmpty: boolean;
}

export const Numpad: React.FC<NumpadProps> = ({ onPress, mode, countdown, isInputEmpty }) => {
  const shouldShowKey = (key: string) => {
    if (mode.includes("から2進数") && !["0", "1", "11", "00", "delete", "clear", "answer"].includes(key)) {
      return false;
    }
    
    if (mode.includes("から16進数")) {
      return true;
    }
    
    if (mode.includes("から10進数") && 
        !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "delete", "clear", "answer"].includes(key)) {
      return false;
    }
    
    return true;
  };

  if (mode.includes("から2進数")) {
    return (
      <div className="mt-4 w-80 text-center p-4 border rounded bg-gray-50">
        <p className="text-gray-500">テンキーは後日追加します</p>
      </div>
    );
  }

  return (
    <div className="mt-4 w-80 numpad-container">
      <div className="grid grid-cols-6 gap-1">
        {/* 1列目: 1|2|3|削除(2列分)|クリア */}
        {shouldShowKey("1") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("1")}
            disabled={countdown !== null}
            style={{ gridColumn: "1", gridRow: "1" }}
          >1</button>
        )}

        {shouldShowKey("11") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("11")}
            disabled={countdown !== null}
            style={{ gridColumn: "2", gridRow: "1" }}
          >11</button>
        )}
          
        {shouldShowKey("2") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("2")}
            disabled={countdown !== null}
            style={{ gridColumn: "2", gridRow: "1" }}
          >2</button>
        )}
        
        {shouldShowKey("3") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("3")}
            disabled={countdown !== null}
            style={{ gridColumn: "3", gridRow: "1" }}
          >3</button>
        )}
        
        <button 
          className="p-2 bg-red-100 text-red-800 rounded hover:bg-red-200" 
          onClick={() => onPress("delete")}
          disabled={countdown !== null}
          style={{ gridColumn: "4 / span 2", gridRow: "1" }}
        >削除</button>
        
        <button 
          className="p-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 whitespace-nowrap min-w-[64px]" 
          onClick={() => onPress("clear")}
          disabled={countdown !== null}
          style={{ gridColumn: "6", gridRow: "1" }}
        >クリア</button>
        
        {/* 2列目: 4|5|6|回答(2列分, 3行分の高さ) */}
        {shouldShowKey("4") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("4")}
            disabled={countdown !== null}
            style={{ gridColumn: "1", gridRow: "2" }}
          >4</button>
        )}
        
        {shouldShowKey("5") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("5")}
            disabled={countdown !== null}
            style={{ gridColumn: "2", gridRow: "2" }}
          >5</button>
        )}
        
        {shouldShowKey("6") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("6")}
            disabled={countdown !== null}
            style={{ gridColumn: "3", gridRow: "2" }}
          >6</button>
        )}
        
        {/* 回答ボタン　2x3の長方形にしてる */}
        <button 
          className="p-2 bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center justify-center" 
          onClick={() => onPress("answer")}
          disabled={countdown !== null || isInputEmpty}
          style={{ gridColumn: "4 / span 2", gridRow: "2 / span 3" }}
        >回答</button>
        
        {/* 空のセル */}
        <div style={{ gridColumn: "6", gridRow: "2" }}></div>
        
        {/* 3列目: 7|8|9|(回答の続き) */}
        {shouldShowKey("7") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("7")}
            disabled={countdown !== null}
            style={{ gridColumn: "1", gridRow: "3" }}
          >7</button>
        )}
        
        {shouldShowKey("8") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("8")}
            disabled={countdown !== null}
            style={{ gridColumn: "2", gridRow: "3" }}
          >8</button>
        )}
        
        {shouldShowKey("9") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("9")}
            disabled={countdown !== null}
            style={{ gridColumn: "3", gridRow: "3" }}
          >9</button>
        )}
        
        <div style={{ gridColumn: "6", gridRow: "3" }}></div>
        
        {/* 4列目: 0|00|空白|空白（回答ボタンは上のボタンに統合） */}
        {shouldShowKey("0") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("0")}
            disabled={countdown !== null}
            style={{ gridColumn: "1", gridRow: "4" }}
          >0</button>
        )}
        
        {shouldShowKey("00") && (
          <button 
            className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
            onClick={() => onPress("00")}
            disabled={countdown !== null}
            style={{ gridColumn: "2", gridRow: "4" }}
          >00</button>
        )}
        
        {/* 空白 */}
        <div style={{ gridColumn: "3", gridRow: "4" }}></div>
        
        {/* 空白 */}
        <div style={{ gridColumn: "6", gridRow: "4" }}></div>
        
        {/* 16進数のキー */}
        <div className="col-span-6 grid grid-cols-6 gap-1 mt-1" style={{ gridColumn: "1 / span 6", gridRow: "5" }}>
          {shouldShowKey("A") && (
            <button 
              className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
              onClick={() => onPress("A")}
              disabled={countdown !== null}
            >A</button>
          )}
          
          {shouldShowKey("B") && (
            <button 
              className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
              onClick={() => onPress("B")}
              disabled={countdown !== null}
            >B</button>
          )}
          
          {shouldShowKey("C") && (
            <button 
              className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
              onClick={() => onPress("C")}
              disabled={countdown !== null}
            >C</button>
          )}
          
          {shouldShowKey("D") && (
            <button 
              className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
              onClick={() => onPress("D")}
              disabled={countdown !== null}
            >D</button>
          )}
          
          {shouldShowKey("E") && (
            <button 
              className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
              onClick={() => onPress("E")}
              disabled={countdown !== null}
            >E</button>
          )}
          
          {shouldShowKey("F") && (
            <button 
              className="p-2 bg-gray-200 rounded hover:bg-gray-300" 
              onClick={() => onPress("F")}
              disabled={countdown !== null}
            >F</button>
          )}
        </div>
      </div>
    </div>
  );
};