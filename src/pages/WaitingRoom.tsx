import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Copy, Check, Play, Loader } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { startRound } from '../lib/gameLogic';

export default function WaitingRoom() {
  const navigate = useNavigate();
  const { gameCode } = useParams<{ gameCode: string }>();
  const { game, loading } = useGame(gameCode || null);

  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const playerId = localStorage.getItem('playerId');

  // Cuando el juego pasa a active, redirigir a la ronda
  useEffect(() => {
    if (game && game.state === 'active' && game.currentRound > 0) {
      navigate(`/round/${game.currentRound}`);
    }
  }, [game, navigate]);

  const handleCopyCode = async () => {
    if (!gameCode) return;

    try {
      // Intentar con navigator.clipboard primero
      await navigator.clipboard.writeText(gameCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback para contextos no seguros
      const textArea = document.createElement('textarea');
      textArea.value = gameCode;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Error al copiar:', e);
        alert(`Código: ${gameCode}\n\nCopia este código manualmente.`);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleStartGame = async () => {
    if (!gameCode || !isAdmin) return;

    setStarting(true);
    try {
      await startRound(gameCode, 1);
      // La navegación se hará automáticamente cuando el estado cambie
    } catch (err) {
      console.error('Error al iniciar juego:', err);
      alert('Error al iniciar el juego');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando sala...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Sala no encontrada</p>
          <button onClick={() => navigate('/')} className="primary-button">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const players = Object.values(game.players);
  const activePlayers = players.filter(p => p.isActive);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Sala de Espera
          </h1>
          <p className="text-gray-400">
            {isAdmin ? 'Esperando que los estudiantes se unan...' : 'Esperando que el profesor inicie el juego...'}
          </p>
        </motion.div>

        {/* Código del juego */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="dramatic-card p-8 mb-6 text-center"
        >
          <p className="text-gray-400 mb-2">Código del Juego:</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-5xl font-bold text-purple-300 tracking-widest font-mono">
              {gameCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
              title="Copiar código"
            >
              {copied ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <Copy className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
          {isAdmin && (
            <p className="text-sm text-gray-400 mt-4">
              Comparte este código con tus estudiantes
            </p>
          )}
        </motion.div>

        {/* Lista de jugadores */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="dramatic-card p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Jugadores ({activePlayers.length})
          </h2>

          <div className="grid md:grid-cols-2 gap-3">
            {players.map((player, index) => (
              <motion.div
                key={player.uid}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  player.uid === playerId
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-slate-700 bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      player.isActive ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="font-semibold text-white">
                        {player.name}
                        {player.uid === playerId && (
                          <span className="text-purple-400 text-sm ml-2">(Tú)</span>
                        )}
                      </p>
                      {player.isAdmin && (
                        <span className="text-xs text-yellow-400">👑 Profesor</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {activePlayers.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              Esperando jugadores...
            </p>
          )}
        </motion.div>

        {/* Botón iniciar (solo admin) */}
        {isAdmin && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={handleStartGame}
              disabled={starting || activePlayers.length < 1}
              className="primary-button w-full flex items-center justify-center gap-2 text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  Iniciando juego...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Iniciar Ronda 1
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Mínimo 1 jugador para comenzar • {activePlayers.length} {activePlayers.length === 1 ? 'jugador' : 'jugadores'} en sala
            </p>
          </motion.div>
        )}

        {/* Mensaje para estudiantes */}
        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center p-6 bg-slate-800/50 rounded-lg"
          >
            <p className="text-gray-300">
              <Loader className="w-5 h-5 inline animate-spin mr-2" />
              Esperando que el profesor inicie el juego...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
