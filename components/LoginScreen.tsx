import React, { useState } from 'react';
import { Footer } from './Footer';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-cyan-200 p-4">
      <div className="w-full max-w-md text-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">
          🧮 TÍNH NHANH 6
        </h1>
        <p className="text-lg text-gray-600 mb-8">Ứng dụng luyện toán có giọng nói AI</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn..."
            className="w-full px-4 py-3 text-lg border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            required
          />
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white font-bold text-xl py-3 rounded-lg hover:bg-blue-700 active:scale-95 transform transition duration-300 shadow-md"
          >
            Bắt đầu
          </button>
        </form>

        <Footer className="mt-8" />
      </div>
    </div>
  );
};
