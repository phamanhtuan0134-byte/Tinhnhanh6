import React, { useMemo, useState } from 'react';
import { ScoreEntry } from '../types';
import { Footer } from './Footer';

interface LeaderboardScreenProps {
  scores: ScoreEntry[];
  onBack: () => void;
}

type SortKey = 'user' | 'score' | 'timestamp';
type SortDirection = 'ascending' | 'descending';

const SortableHeader: React.FC<{
  label: string;
  sortKey: SortKey;
  sortConfig: { key: SortKey; direction: SortDirection };
  requestSort: (key: SortKey) => void;
  className?: string;
}> = ({ label, sortKey, sortConfig, requestSort, className }) => {
  const isSorted = sortConfig.key === sortKey;
  const directionIcon = sortConfig.direction === 'ascending' ? '▲' : '▼';
  return (
    <th className={`p-3 cursor-pointer select-none ${className}`} onClick={() => requestSort(sortKey)}>
      {label} {isSorted && <span className="text-xs">{directionIcon}</span>}
    </th>
  );
};

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ scores, onBack }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'score', direction: 'descending' });

  const sortedScores = useMemo(() => {
    const sortableItems = [...scores];
    if (sortConfig) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'user') {
           const comparison = (aValue as string).localeCompare(bValue as string, 'vi', { sensitivity: 'base' });
           return sortConfig.direction === 'ascending' ? comparison : -comparison;
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [scores, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const medal = (index: number) => {
    if (sortConfig.key !== 'score' || sortConfig.direction !== 'descending') {
      return `${index + 1}.`;
    }
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400 p-4 relative">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">🏆 Bảng Xếp Hạng 🏆</h1>

        <div className="max-h-96 overflow-y-auto pr-2 border rounded-lg bg-white/50">
          {sortedScores.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-gray-200/70 sticky top-0">
                <tr>
                  <th className="p-3 w-16">Hạng</th>
                  <SortableHeader label="Tên học sinh" sortKey="user" sortConfig={sortConfig} requestSort={requestSort} />
                  <SortableHeader label="Điểm" sortKey="score" sortConfig={sortConfig} requestSort={requestSort} className="w-28 text-center" />
                  <SortableHeader label="Ngày Thi" sortKey="timestamp" sortConfig={sortConfig} requestSort={requestSort} className="w-36 text-right" />
                </tr>
              </thead>
              <tbody>
                {sortedScores.map((entry, index) => (
                  <tr key={`${entry.user}-${entry.timestamp}-${index}`} className="border-b last:border-b-0 hover:bg-gray-100/50">
                    <td className="p-3 font-bold w-16 text-center">{medal(index)}</td>
                    <td className="p-3 font-semibold text-gray-700">{entry.user}</td>
                    <td className="p-3 font-bold text-blue-600 text-center">{entry.score}</td>
                    <td className="p-3 text-gray-600 text-right">{new Date(entry.timestamp).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-600 py-8">Chưa có ai thi đấu. Hãy là người đầu tiên!</p>
          )}
        </div>
        
        <button
          onClick={onBack}
          className="w-full mt-8 bg-gray-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-gray-700 active:scale-95 transform transition duration-300 shadow-md"
        >
          Quay lại
        </button>
      </div>
      <Footer className="absolute bottom-4 text-center w-full" />
    </div>
  );
};
