import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Home, Star, Sparkles } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { useState, useEffect } from 'react';

export default function End() {
  const navigate = useNavigate();
  const gameCode = localStorage.getItem('gameCode');
  const playerId = localStorage.getItem('playerId');
  const { game } = useGame(gameCode);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="primary-button"
          >
            <Home className="w-5 h-5 inline mr-2" />
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const players = Object.values(game.players);
  const sortedPlayers = [...players].sort((a, b) => b.averageScore - a.averageScore);
  const playerRank = sortedPlayers.findIndex(p => p.uid === playerId) + 1;

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⭐';
  };

  const getPodiumHeight = (rank: number) => {
    if (rank === 1) return 'h-48'; // Más alto
    if (rank === 2) return 'h-36'; // Mediano
    if (rank === 3) return 'h-28'; // Más bajo
    return 'h-20';
  };

  const getPodiumColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-600 to-yellow-400';
    if (rank === 2) return 'from-gray-400 to-gray-300';
    if (rank === 3) return 'from-amber-700 to-amber-500';
    return 'from-slate-600 to-slate-500';
  };

  const topThree = sortedPlayers.slice(0, 3);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                x: Math.random() * window.innerWidth,
                y: -20,
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: ['#FFD700', '#C0C0C0', '#CD7F32', '#9333EA', '#06B6D4'][Math.floor(Math.random() * 5)],
              }}
            />
          ))}
        </>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            ¡Juego Completado!
          </h1>
          <p className="text-xl text-gray-300">
            {playerRank <= 3 ? '¡Felicidades!' : `Quedaste en el puesto #${playerRank}`}
          </p>
        </motion.div>

        {/* Podio Olímpico */}
        {topThree.length >= 3 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="flex items-end justify-center gap-4 md:gap-8">
              {/* Segundo Lugar (Izquierda) */}
              {topThree[1] && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center flex-1 max-w-xs"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.3,
                    }}
                    className="mb-4"
                  >
                    <div className="text-6xl mb-2">🥈</div>
                    <div className={`p-4 rounded-t-lg border-4 ${
                      topThree[1].uid === playerId ? 'border-purple-500' : 'border-gray-300'
                    }`}>
                      <p className="font-bold text-white text-lg text-center mb-1">
                        {topThree[1].name}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-white">
                          {topThree[1].averageScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  <div className={`w-full ${getPodiumHeight(2)} bg-gradient-to-t ${getPodiumColor(2)} rounded-t-xl flex items-center justify-center border-4 border-gray-300`}>
                    <span className="text-6xl font-bold text-white drop-shadow-lg">2</span>
                  </div>
                </motion.div>
              )}

              {/* Primer Lugar (Centro) */}
              {topThree[0] && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center flex-1 max-w-xs"
                >
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="mb-4"
                  >
                    <div className="text-8xl mb-2">🥇</div>
                    <div className={`p-6 rounded-t-lg border-4 ${
                      topThree[0].uid === playerId ? 'border-purple-500' : 'border-yellow-400'
                    }`}>
                      <p className="font-bold text-white text-xl text-center mb-2">
                        {topThree[0].name}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <span className="text-3xl font-bold text-white">
                          {topThree[0].averageScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  <div className={`w-full ${getPodiumHeight(1)} bg-gradient-to-t ${getPodiumColor(1)} rounded-t-xl flex items-center justify-center border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50`}>
                    <span className="text-7xl font-bold text-white drop-shadow-lg">1</span>
                  </div>
                </motion.div>
              )}

              {/* Tercer Lugar (Derecha) */}
              {topThree[2] && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col items-center flex-1 max-w-xs"
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.6,
                    }}
                    className="mb-4"
                  >
                    <div className="text-6xl mb-2">🥉</div>
                    <div className={`p-4 rounded-t-lg border-4 ${
                      topThree[2].uid === playerId ? 'border-purple-500' : 'border-amber-600'
                    }`}>
                      <p className="font-bold text-white text-lg text-center mb-1">
                        {topThree[2].name}
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-white">
                          {topThree[2].averageScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  <div className={`w-full ${getPodiumHeight(3)} bg-gradient-to-t ${getPodiumColor(3)} rounded-t-xl flex items-center justify-center border-4 border-amber-600`}>
                    <span className="text-6xl font-bold text-white drop-shadow-lg">3</span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Ranking Completo */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="dramatic-card p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">
            Ranking Completo
          </h2>

          <div className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.uid}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                className={`p-4 rounded-lg border flex items-center justify-between ${
                  player.uid === playerId
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-slate-700 bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 text-center">
                    {index < 3 ? (
                      <span className="text-3xl">{getMedalEmoji(index + 1)}</span>
                    ) : (
                      <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      {player.name}
                      {player.uid === playerId && (
                        <span className="text-purple-400 text-sm ml-2">(Tú)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {player.completedRounds} rondas • Total: {player.totalScore.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-white">
                    {player.averageScore.toFixed(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className="primary-button flex-1 flex items-center justify-center gap-2"
          >
            <Trophy className="w-5 h-5" />
            Jugar de Nuevo
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-purple-500/30"
          >
            <Home className="w-5 h-5" />
            Inicio
          </button>
        </motion.div>

        {/* Mensaje final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30 text-center"
        >
          <p className="text-gray-300">
            Gracias por jugar <strong className="text-purple-300">Analista en Modo Crisis</strong>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Código de sala: <strong className="text-purple-300">{gameCode}</strong>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
