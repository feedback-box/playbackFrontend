import React from "react";

interface ProgressBarProps {
  bgcolor: string;
  completed: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ bgcolor, completed }) => {
  const cappedCompleted = Math.min(completed, 100); // Cap the completed percentage at 100

  return (
    <div className="h-8 w-full bg-gray-300 rounded-full my-4">
      <div
        className="h-full rounded-full text-right transition-width duration-500 ease-in-out"
        style={{ width: `${cappedCompleted}%`, backgroundColor: bgcolor }}
      >
        <span className="text-white font-bold pr-2">{`${cappedCompleted}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
