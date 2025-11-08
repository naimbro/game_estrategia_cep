import { Trophy, Medal, Award, Star } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';

interface LeaderboardComponentProps {
  entries: LeaderboardEntry[];
  currentPlayerId?: string;
  className?: string;
}

export default function LeaderboardComponent({
  entries,
  currentPlayerId,
  className = ''
}: LeaderboardComponentProps) {
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400" />;
      case 2:
        return <Medal className="w-7 h-7 text-gray-300 fill-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600 fill-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-600 to-yellow-400';
      case 2:
        return 'from-gray-500 to-gray-300';
      case 3:
        return 'from-amber-700 to-amber-500';
      default:
        return 'from-slate-700 to-slate-600';
    }
  };

  return (
    <div className={`dramatic-card p-6 ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        <h2 className="text-2xl font-bold text-purple-300">
          Ranking Global
        </h2>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No hay datos en el ranking aún.</p>
          <p className="text-sm mt-2">¡Sé el primero en completar una partida!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isCurrentPlayer = entry.playerId === currentPlayerId;

            return (
              <div
                key={entry.playerId}
                className={`relative overflow-hidden rounded-xl transition-all ${
                  isCurrentPlayer
                    ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20'
                    : ''
                }`}
              >
                {/* Fondo gradiente según ranking */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getRankColor(
                    rank
                  )} opacity-10`}
                />

                <div className="relative p-4 flex items-center gap-4">
                  {/* Medalla/Número */}
                  <div className="flex items-center justify-center w-12 shrink-0">
                    {rank <= 3 ? (
                      getMedalIcon(rank)
                    ) : (
                      <span className="text-2xl font-bold text-gray-500">
                        #{rank}
                      </span>
                    )}
                  </div>

                  {/* Información del jugador */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white truncate">
                      {entry.playerName}
                      {isCurrentPlayer && (
                        <span className="ml-2 text-sm text-purple-400">(Tú)</span>
                      )}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                      <span>
                        Ronda: <strong>{entry.roundScore.toFixed(1)}</strong>
                      </span>
                      <span className="text-gray-600">•</span>
                      <span>
                        Total: <strong>{entry.totalScore.toFixed(1)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Puntaje promedio */}
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold text-white">
                        {entry.averageScore.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">promedio</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
