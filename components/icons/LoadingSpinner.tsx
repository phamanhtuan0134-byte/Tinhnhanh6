
import React from 'react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-white ${className}`} />
);
