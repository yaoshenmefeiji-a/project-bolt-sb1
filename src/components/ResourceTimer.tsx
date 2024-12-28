import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface ResourceTimerProps {
  remainingTime: number;
}

export function ResourceTimer({ remainingTime }: ResourceTimerProps) {
  const [timeLeft, setTimeLeft] = useState(remainingTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTimeLeft(remainingTime);
  }, [remainingTime]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const getTimerStyle = () => {
    if (timeLeft < 60000) { // 小于1分钟
      return {
        containerClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-700',
        pulseClass: 'animate-pulse'
      };
    }
    if (timeLeft < 300000) { // 小于5分钟
      return {
        containerClass: 'bg-orange-50 border-orange-200',
        textClass: 'text-orange-700',
        pulseClass: ''
      };
    }
    return {
      containerClass: 'bg-blue-50 border-blue-200',
      textClass: 'text-blue-700',
      pulseClass: ''
    };
  };

  const { containerClass, textClass, pulseClass } = getTimerStyle();

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${containerClass} ${pulseClass}`}>
        <Clock className={`h-4 w-4 ${textClass}`} />
        <div className={`font-medium ${textClass}`}>
          <span className="text-lg">{minutes}</span>
          <span className="text-sm">分</span>
          <span className="text-lg ml-1">{seconds.toString().padStart(2, '0')}</span>
          <span className="text-sm">秒</span>
        </div>
      </div>
      <div className="flex items-start gap-1.5 px-1">
        <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-500 leading-5">
          子网将在锁定时间结束后自动释放，请及时完成付款以确保资源不被他人选择
        </p>
      </div>
    </div>
  );
}