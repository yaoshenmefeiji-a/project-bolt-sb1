import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface ResourceTimerProps {
  getRemainingTime: () => number;
}

export function ResourceTimer({ getRemainingTime }: ResourceTimerProps) {
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [getRemainingTime]);

  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  function getBgColor(time: number) {
    if (time <= 60000) return 'bg-red-50 text-red-700 animate-pulse'; // 1分钟以下
    if (time <= 300000) return 'bg-amber-50 text-amber-700'; // 5分钟以下
    return 'bg-blue-50 text-blue-700'; // 正常状态
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${getBgColor(remainingTime)}`}>
      <Clock className="h-4 w-4" />
      <span className="text-sm font-medium whitespace-nowrap">
        剩余锁定时间: {minutes}分{seconds.toString().padStart(2, '0')}秒
      </span>
    </div>
  );
}