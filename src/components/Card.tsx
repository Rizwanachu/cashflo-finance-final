import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] shadow-sm overflow-hidden flex flex-col p-4 sm:p-5 ${className}`}
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

