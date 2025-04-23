import React from "react";

interface RankingInputModalContentProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const RankingInputModalContent: React.FC<RankingInputModalContentProps> = ({
  playerName,
  setPlayerName,
  onSave,
  onCancel
}) => {
  return (
    <>
      <h2 className="text-xl font-bold">ランキング登録</h2>
      <p className="text-md mt-2">あなたの名前を入力してください</p>
      
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="w-full p-2 border rounded mt-4"
        placeholder="名前を入力"
        maxLength={10}
      />
      
      <div className="flex justify-between mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          キャンセル
        </button>
        
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!playerName.trim()}
        >
          登録
        </button>
      </div>
    </>
  );
};