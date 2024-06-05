import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  duration: number;
  onComplete: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          onComplete();
          return prev;
        }
      });
    }, duration * 10); // duration in milliseconds

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="w-full bg-gray-300 h-9 overflow-hidden">
      <div
        className="bg-red-500 h-full text-white text-bold flex items-center justify-center"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
