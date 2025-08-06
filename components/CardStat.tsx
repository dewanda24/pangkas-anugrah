// components/CardStat.tsx
import { ReactNode } from "react";

interface CardStatProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
}

export default function CardStat({ title, value, icon }: CardStatProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </h4>
        {icon && <div className="text-xl text-gray-400">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
