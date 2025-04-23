import React, { FormEvent } from 'react';

interface RankingModalProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean; 
}

export const RankingInputModalContent: React.FC<RankingModalProps> = ({
  playerName,
  setPlayerName,
  onSave,
  onCancel,
  isSubmitting = false 
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">ランキングに名前を登録</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="playerName" className="block mb-1">名前</label>
          <input
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="名前を入力してください"
            className="px-3 py-2 border rounded w-full"
            disabled={isSubmitting}
            maxLength={20}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className={`px-3 py-1 bg-blue-500 text-white rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? '登録中...' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  );
};