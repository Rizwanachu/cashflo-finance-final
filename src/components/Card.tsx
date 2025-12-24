import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col ${className}`}
      style={{ padding: "20px" }}
    >
      {children}
    </div>
  );
};

export const ChartContainer: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  return (
    <div className="w-full relative h-[200px] md:h-[220px] lg:h-[260px]">
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

