import React from 'react';

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <p>Lớp: 6a1 - Trường: THCS Kim Chung</p>
      <p>GVHD: Lê Thị Nga</p>
      <p>Hội thi Ứng dụng công nghệ AI - 2025–2026</p>
    </div>
  );
};
