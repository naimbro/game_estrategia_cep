import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  endTime: number; // Timestamp en ms
  onExpire: () => void;
  className?: string;
}

export default function Timer({ endTime, onExpire, className = '' }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);

      if (remaining === 0) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const percentage = Math.max(0, Math.min(100, (timeLeft / (3 * 60 * 1000)) * 100));

  // Colores según tiempo restante
  const getColorClass = () => {
    if (percentage > 50) return 'text-green-400 border-green-400';
    if (percentage > 25) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400 animate-pulse';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Clock className={`w-6 h-6 ${getColorClass()}`} />
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${getColorClass()}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              percentage > 50
                ? 'bg-green-500'
                : percentage > 25
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
