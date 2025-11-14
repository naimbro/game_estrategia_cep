import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  endTime: number; // Timestamp en ms
  onExpire: () => void;
  className?: string;
  isPaused?: boolean;
  totalDuration?: number; // Duración total en ms (para cálculo de porcentaje)
  gracePeriod?: number; // Periodo de gracia después del timer principal (en ms)
}

export default function Timer({
  endTime,
  onExpire,
  className = '',
  isPaused = false,
  totalDuration = 5 * 60 * 1000, // Default 5 minutos
  gracePeriod = 2 * 60 * 1000 // Default 2 minutos de periodo de gracia
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const [isInGracePeriod, setIsInGracePeriod] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    if (isPaused) {
      // Guardar el tiempo restante cuando se pausa
      setPausedTime(timeLeft);
      return;
    }

    const updateTimer = () => {
      if (pausedTime > 0) {
        // Si se reanuda, usar el tiempo guardado
        setTimeLeft(pausedTime);
        setPausedTime(0);
      } else {
        const now = Date.now();
        let remaining = Math.max(0, endTime - now);

        // Si el tiempo principal expiró, entrar en periodo de gracia
        if (remaining === 0 && !hasExpired) {
          setHasExpired(true);
          setIsInGracePeriod(true);
          remaining = gracePeriod; // Iniciar con el tiempo de gracia completo
        }

        // Si estamos en periodo de gracia, contar hacia atrás desde gracePeriod
        if (isInGracePeriod) {
          const graceRemaining = gracePeriod - (now - endTime);
          remaining = Math.max(0, graceRemaining);

          // Solo llamar onExpire cuando el periodo de gracia también expire
          if (remaining === 0) {
            onExpire();
          }
        }

        setTimeLeft(remaining);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 100);

    return () => clearInterval(interval);
  }, [endTime, onExpire, isPaused, pausedTime, timeLeft, gracePeriod, isInGracePeriod, hasExpired]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  // Calcular porcentaje basado en si estamos en periodo de gracia o no
  const percentage = isInGracePeriod
    ? Math.max(0, Math.min(100, (timeLeft / gracePeriod) * 100))
    : Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100));

  // Colores según tiempo restante
  const getColorClass = () => {
    if (isInGracePeriod) {
      return 'text-orange-400 border-orange-400 animate-pulse';
    }
    if (percentage > 50) return 'text-green-400 border-green-400';
    if (percentage > 25) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400 animate-pulse';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Clock className={`w-6 h-6 ${getColorClass()}`} />
      <div className="flex flex-col">
        {isInGracePeriod && (
          <span className="text-xs text-orange-300 font-semibold uppercase">
            ⏱️ Tiempo Extra
          </span>
        )}
        <span className={`text-2xl font-bold ${getColorClass()}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isInGracePeriod
                ? 'bg-orange-500'
                : percentage > 50
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
