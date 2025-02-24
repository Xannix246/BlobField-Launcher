import clsx from "clsx";
import React from "react";

type ProgressBarProps = {
  progress: number;
  message?: string;
  style?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, style, message = "Loading resources..." }) => {
    const className = clsx(style, "w-full h-4 bg-gray-300 rounded-full overflow-hidden");
  return (
    <div className="w-[70%] grid gap-2 font-second">
        // {message}
        <div className={className}>
            <div
                className="h-full bg-gradient-to-r from-[#cccc00] to-ak-yellow transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
  );
};

export default ProgressBar;