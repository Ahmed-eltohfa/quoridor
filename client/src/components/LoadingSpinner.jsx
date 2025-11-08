import React from 'react';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-4 h-4 border-2',
        default: 'w-8 h-8 border-3',
        large: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
        <div
            className={`${sizeClasses[size]} border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-transparent rounded-full animate-spin`}
        />
        {text && <div className="text-gray-400 text-sm">{text}</div>}
        </div>
    );
};

export const LoadingScreen = ({ text = 'Loading...' }) => {
    return (
        <div className="min-h-screen bg-[#071018] flex items-center justify-center w-full">
        <LoadingSpinner size="large" text={text} />
        </div>
    );
};

export default LoadingSpinner;