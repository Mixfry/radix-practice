import React, { useState, useEffect } from "react";
import { RankingItem } from "../types/ranking";
import { getRankingData } from "../utils/ranking";
import { formatTime } from "../utils/format";

interface RankingListProps {
  className?: string;
}

type SortColumn = "rank" | "name" | "correct" | "score" | "time" | "mode";
type SortDirection = "asc" | "desc";

interface RankedItem extends RankingItem {
  rank: number;
}

export const RankingList: React.FC<RankingListProps> = ({ className }) => {
  const [rankings, setRankings] = useState<RankedItem[]>([]);
  const [filteredRankings, setFilteredRankings] = useState<RankedItem[]>([]);
  
  const [modeFilter, setModeFilter] = useState<string | null>(null);
  const [questionCountFilter, setQuestionCountFilter] = useState<string>("10問");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  
  const [sortColumn, setSortColumn] = useState<SortColumn>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const modes = [
    "2進数から10進数",
    "10進数から2進数",
    "10進数から16進数",
    "16進数から2進数",
    "16進数から10進数",
  ];
  
  const questionCounts = ["10問", "タイムアタック"];
  
  const difficultyLevels = [
    { id: "beginner", displayName: "初級" },
    { id: "intermediate", displayName: "中級" },
    { id: "expert", displayName: "上級" }
  ];

  const difficultyColors = {
    beginner: {
      bg: "bg-green-100",
      text: "text-green-800",
      button: {
        active: "bg-green-500 text-white",
        inactive: "bg-green-100 hover:bg-green-200 text-green-800"
      }
    },
    intermediate: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      button: {
        active: "bg-yellow-500 text-white",
        inactive: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
      }
    },
    expert: {
      bg: "bg-red-100",
      text: "text-red-800",
      button: {
        active: "bg-red-500 text-white",
        inactive: "bg-red-100 hover:bg-red-200 text-red-800"
      }
    }
  };

  const getDifficultyColor = (difficultyId: string, type: "bg" | "text" | "button", isActive = false) => {
    const colorSet = difficultyColors[difficultyId as keyof typeof difficultyColors];
    if (!colorSet) return "";
    
    if (type === "button") {
      return isActive ? colorSet.button.active : colorSet.button.inactive;
    }
    
    return colorSet[type];
  };

  const formatMode = (mode: string): string => {
    if (mode.includes("から")) {
      const parts = mode.split("から");
      const from = parts[0].replace("進数", "");
      const to = parts[1].replace("進数", "");
      return `${from}»${to}進数`;
    }
    return mode;
  };

  const getDifficultyName = (difficultyId: string): string => {
    const difficulty = difficultyLevels.find(level => level.id === difficultyId);
    return difficulty ? difficulty.displayName : difficultyId;
  };
  
  useEffect(() => {
    const fetchRankings = async () => {
      const rankingData = await getRankingData();
      
      const rankedData = rankingData
        .sort((a, b) => b.score - a.score)
        .map((item, index) => ({
          ...item,
          rank: index + 1
        }));
      
      setRankings(rankedData);
      setFilteredRankings(rankedData);
    };
    
    fetchRankings();
  }, []);
  
  useEffect(() => {
    let result = [...rankings];
    
    if (modeFilter) {
      result = result.filter(item => item.mode === modeFilter);
    }
    
    if (questionCountFilter) {
      result = result.filter(item => {
        if (questionCountFilter === "10問") {
          return item.totalQuestions === 10;
        } else {
          return item.totalQuestions !== 10;
        }
      });
    }
    
    if (difficultyFilter) {
      result = result.filter(item => item.difficulty === difficultyFilter);
    }
    
    setFilteredRankings(result);
    setCurrentPage(1);
  }, [rankings, modeFilter, questionCountFilter, difficultyFilter]);
  
  const toggleModeFilter = (mode: string) => {
    if (modeFilter === mode) {
      setModeFilter(null);
    } else {
      setModeFilter(mode);
    }
  };
  
  const setQuestionCountFilterValue = (count: string) => {
    setQuestionCountFilter(count);
  };
  
  const toggleDifficultyFilter = (level: string) => {
    if (difficultyFilter === level) {
      setDifficultyFilter(null);
    } else {
      setDifficultyFilter(level);
    }
  };
  
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const calculateRank = (index: number, totalItems: number) => {
    if (sortDirection === "asc") {
      return totalItems - index;
    }
    return index + 1;
  };

  const isTimeAttackMode = (item: RankingItem) => {
    return item.totalQuestions !== 10; 
  };
  
  const getDisplayTime = (ranking: RankingItem) => {
    if (isTimeAttackMode(ranking) && ranking.totalQuestions > 0) {
      const secondsPerQuestion = 60 / ranking.totalQuestions;
      const formattedSeconds = secondsPerQuestion.toFixed(2);
      return `${formattedSeconds}秒`;
    } else {
      return formatTime(ranking.time);
    }
  };
  
  const sortedRankings = [...filteredRankings].sort((a, b) => {
    let compareValueA, compareValueB;
    
    switch (sortColumn) {
      case "rank":
        compareValueA = a.score;
        compareValueB = b.score;
        if (sortDirection === "desc") {
          return compareValueB - compareValueA; 
        } else {
          return compareValueA - compareValueB;
        }
      case "name":
        compareValueA = a.name.toLowerCase();
        compareValueB = b.name.toLowerCase();
        break;
      case "correct":
        compareValueA = a.correctAnswers !== undefined ? a.correctAnswers / (a.totalQuestions || 1) : 0;
        compareValueB = b.correctAnswers !== undefined ? b.correctAnswers / (b.totalQuestions || 1) : 0;
        break;
      case "score":
        compareValueA = a.score;
        compareValueB = b.score;
        break;
      case "time":
        if (isTimeAttackMode(a) && isTimeAttackMode(b) && a.totalQuestions > 0 && b.totalQuestions > 0) {
          compareValueA = 60 / a.totalQuestions;
          compareValueB = 60 / b.totalQuestions;
        } else {
          compareValueA = a.time;
          compareValueB = b.time;
        }
        if (sortDirection === "desc") {
          if (isTimeAttackMode(a) && isTimeAttackMode(b)) {
            return compareValueB - compareValueA;
          } else {
            return compareValueA - compareValueB;
          }
        } else {
          if (isTimeAttackMode(a) && isTimeAttackMode(b)) {
            return compareValueA - compareValueB;
          } else {
            return compareValueB - compareValueA;
          }
        }
      case "mode":
        compareValueA = `${a.mode}-${a.difficulty}`;
        compareValueB = `${b.mode}-${b.difficulty}`;
        break;
      default:
        return 0;
    }
    
    if (compareValueA < compareValueB) {
      return sortDirection === "asc" ? -1 : 1;
    }
    if (compareValueA > compareValueB) {
      return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });
  
  const totalPages = Math.ceil(sortedRankings.length / itemsPerPage);
  
  const getPaginatedRankings = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRankings.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-4 mb-4 space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded ${
            currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          &laquo;
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded ${
            currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          &lt;
        </button>
        
        <span className="px-2 py-1 text-gray-700">
          {currentPage} / {totalPages}
        </span>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded ${
            currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          &gt;
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded ${
            currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          &raquo;
        </button>
      </div>
    );
  };
  
  if (rankings.length === 0) {
    return <p className="text-center text-gray-500">まだランキングデータがありません</p>;
  }
  
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? "↑" : "↓";
    }
    return null;
  };
  
  return (
    <div className={`${className || ""}`}>
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">ジャンルでフィルタ</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {modes.map(mode => (
            <button
              key={mode}
              onClick={() => toggleModeFilter(mode)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                modeFilter === mode 
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        
        <h3 className="text-sm font-medium mb-2">モードでフィルタ</h3>
        <div className="flex flex-wrap gap-4 mb-3">
          {questionCounts.map(count => (
            <label
              key={count}
              className="flex items-center text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="questionCount"
                value={count}
                checked={questionCountFilter === count}
                onChange={() => setQuestionCountFilterValue(count)}
                className="mr-2"
              />
              {count}
            </label>
          ))}
        </div>
        
        <h3 className="text-sm font-medium mb-2">難易度でフィルタ</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {difficultyLevels.map(level => (
            <button
              key={level.id}
              onClick={() => toggleDifficultyFilter(level.id)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                difficultyFilter === level.id 
                  ? getDifficultyColor(level.id, "button", true)
                  : getDifficultyColor(level.id, "button", false)
              }`}
            >
              {level.displayName}
            </button>
          ))}
        </div>
        
        {(modeFilter || difficultyFilter) && (
          <div className="flex items-center justify-between mt-2 bg-blue-50 p-2 rounded">
            <div className="text-xs text-blue-800">
              フィルター: 
              {modeFilter && <span className="ml-1 font-medium">{modeFilter}</span>}
              {difficultyFilter && (
                <span className={`ml-1 font-medium px-1.5 py-0.5 rounded ${
                  getDifficultyColor(difficultyFilter, "bg")} ${getDifficultyColor(difficultyFilter, "text")
                }`}>
                  {difficultyLevels.find(level => level.id === difficultyFilter)?.displayName}
                </span>
              )}
            </div>
            <button 
              onClick={() => {
                setModeFilter(null);
                setQuestionCountFilter("10問");
                setDifficultyFilter(null);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              リセット
            </button>
          </div>
        )}
      </div>
      
      {renderPagination()}
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th 
                className="py-2 px-3 text-left cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                onClick={() => handleSort("rank")}
              >
                順位 {getSortIcon("rank")}
              </th>
              <th 
                className="py-2 px-3 text-left cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                onClick={() => handleSort("name")}
              >
                名前 {getSortIcon("name")}
              </th>
              <th 
                className="py-2 px-3 text-left cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                onClick={() => handleSort("score")}
              >
                スコア {getSortIcon("score")}
              </th>
              <th 
                className="py-2 px-3 text-left cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                onClick={() => handleSort("correct")}
              >
                正誤 {getSortIcon("correct")}
              </th>
              <th 
                className="py-2 px-3 text-left cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                onClick={() => handleSort("time")}
              >
                {questionCountFilter === "タイムアタック" ? "1問あたりの時間" : "時間 "}
                {getSortIcon("time")}
              </th>
              <th 
                className="py-2 px-3 text-left cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                onClick={() => handleSort("mode")}
              >
                難易度 {getSortIcon("mode")}
              </th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedRankings().map((ranking, index) => {
              const actualIndex = (currentPage - 1) * itemsPerPage + index;
              return (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-3 font-bold whitespace-nowrap">
                    {calculateRank(actualIndex, sortedRankings.length)}
                  </td> 
                  <td className="py-2 px-3 whitespace-nowrap">{ranking.name}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{ranking.score}</td>
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    {ranking.correctAnswers !== undefined && ranking.totalQuestions !== undefined 
                      ? `${ranking.correctAnswers}/${ranking.totalQuestions}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">{getDisplayTime(ranking)}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{formatMode(ranking.mode)}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full inline-block w-fit mt-1 ${
                        getDifficultyColor(ranking.difficulty, "bg")} ${getDifficultyColor(ranking.difficulty, "text")
                      }`}>
                        {getDifficultyName(ranking.difficulty)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
      
      {sortedRankings.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          フィルター条件に一致する記録がありません
        </p>
      )}
    </div>
  );
};