import React from 'react';

interface TimerProps {
  code: string;
  isRunning: boolean;
  elapsed: number;
  onToggle: () => void;
  onReset: () => void;
}

export const Timer: React.FC<TimerProps> = ({ code, isRunning, elapsed, onToggle, onReset }) => {
  const seconds = Math.floor(elapsed / 1000);
  const milliseconds = Math.floor((elapsed % 1000) / 10);

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isRunning
            ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
            : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
        }`}
        aria-label={isRunning ? 'Stop Timer' : 'Start Timer'}
      >
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        aria-label="Reset Timer"
        disabled={isRunning}
      >
        Reset
      </button>
      <span className="font-mono text-lg min-w-[4.5rem]" aria-label="Timer Display">
        {`${seconds}.${milliseconds.toString().padStart(2, '0')}`}
      </span>
    </div>
  );
};