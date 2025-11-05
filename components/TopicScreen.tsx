import React, { useState } from 'react';
import { Topic, Difficulty, PracticeMode } from '../types';
import { Footer } from './Footer';

interface TopicScreenProps {
  user: string;
  onStart: (topic: Topic, difficulty: Difficulty, mode: PracticeMode) => void;
  onShowLeaderboard: () => void;
  onShowHistory: () => void;
}

const OptionButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void }> = ({ label, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold transition-all duration-200 w-full md:w-auto ${
            isSelected 
                ? 'bg-blue-600 text-white shadow-md scale-105' 
                : 'bg-white text-gray-700 hover:bg-blue-100'
        }`}
    >
        {label}
    </button>
);


export const TopicScreen: React.FC<TopicScreenProps> = ({ user, onStart, onShowLeaderboard, onShowHistory }) => {
    const [topic, setTopic] = useState<Topic>(Topic.Integer);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-100 p-4 relative">
            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-teal-800 mb-2">Xin chào, {user}!</h1>
                <p className="text-gray-600 mb-6">Hãy chọn chủ đề và độ khó để bắt đầu nhé.</p>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-700 mb-3">1. Chọn chủ đề</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.values(Topic).map(t => (
                                <OptionButton key={t} label={t} isSelected={topic === t} onClick={() => setTopic(t)} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-700 mb-3">2. Chọn độ khó</h2>
                        <div className="grid grid-cols-3 gap-3">
                             {Object.values(Difficulty).map(d => (
                                <OptionButton key={d} label={d} isSelected={difficulty === d} onClick={() => setDifficulty(d)} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6 flex flex-col md:flex-row gap-4">
                    <button 
                        onClick={() => onStart(topic, difficulty, PracticeMode.Practice)}
                        className="w-full bg-green-500 text-white font-bold text-lg py-3 rounded-lg hover:bg-green-600 active:scale-95 transform transition duration-300 shadow-md flex-1"
                    >
                        Luyện tập
                    </button>
                    <button 
                        onClick={() => onStart(topic, difficulty, PracticeMode.Quiz)}
                        className="w-full bg-yellow-500 text-white font-bold text-lg py-3 rounded-lg hover:bg-yellow-600 active:scale-95 transform transition duration-300 shadow-md flex-1"
                    >
                        Thi nhanh (5 câu)
                    </button>
                </div>
                 <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={onShowLeaderboard}
                        className="w-full bg-gray-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-gray-700 active:scale-95 transform transition duration-300 shadow-md"
                    >
                        Bảng xếp hạng
                    </button>
                    <button 
                        onClick={onShowHistory}
                        className="w-full bg-indigo-600 text-white font-bold text-lg py-3 rounded-lg hover:bg-indigo-700 active:scale-95 transform transition duration-300 shadow-md"
                    >
                        Lịch sử luyện tập
                    </button>
                </div>
            </div>
            <Footer className="absolute bottom-4 text-center w-full" />
        </div>
    );
};
