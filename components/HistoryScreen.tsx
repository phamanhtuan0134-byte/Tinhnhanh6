import React, { useState } from 'react';
import { HistoryEntry, PracticeMode, QUIZ_LENGTH } from '../types';
import { Footer } from './Footer';

interface HistoryScreenProps {
  history: HistoryEntry[];
  user: string;
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, user, onBack }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const userHistory = history
    .filter(entry => entry.user === user)
    .sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-300 p-4 relative">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-6 text-center">
          Lịch sử luyện tập
        </h1>

        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
          {userHistory.length > 0 ? (
            userHistory.map((entry, index) => (
              <div key={index} className="bg-white/60 p-4 rounded-lg shadow-sm border border-gray-200 transition-all duration-300">
                <button 
                  onClick={() => handleToggle(index)} 
                  className="w-full text-left focus:outline-none"
                  aria-expanded={expandedIndex === index}
                  aria-controls={`details-${index}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-indigo-700">
                        {entry.mode}: {entry.topic} ({entry.difficulty})
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {entry.mode === PracticeMode.Quiz && (
                        <p className="font-bold text-xl text-purple-600">
                          {entry.score}/{QUIZ_LENGTH}
                        </p>
                      )}
                      <span className={`transform transition-transform duration-200 ${expandedIndex === index ? 'rotate-180' : ''}`}>▼</span>
                    </div>
                  </div>
                </button>
                {expandedIndex === index && (
                   <div id={`details-${index}`} className="mt-4 pt-4 border-t border-indigo-100 space-y-3 text-sm">
                    <h4 className="font-bold text-gray-700">Chi tiết:</h4>
                    {entry.attempts.map((attempt, attemptIndex) => (
                      <div key={attemptIndex} className="p-2 bg-gray-50/50 rounded-md">
                        <p className="font-semibold text-gray-800">
                          {attempt.questionText}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p>
                            Bạn trả lời: <span className={`font-bold ${attempt.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {attempt.userAnswer}
                            </span>
                          </p>
                          {!attempt.isCorrect && (
                            <p>
                              Đáp án: <span className="font-bold text-blue-600">{attempt.correctAnswerDisplay}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-8">
              Bạn chưa có lịch sử luyện tập nào.
            </p>
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
