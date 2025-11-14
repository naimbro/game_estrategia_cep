import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Loader } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { getLeaderboardForRound, advanceToNextRound } from '../lib/gameLogic';
import LeaderboardComponent from '../components/LeaderboardComponent';
import NoSubmissionNotification from '../components/NoSubmissionNotification';

export default function Results() {
  const navigate = useNavigate();
  const { roundNumber } = useParams<{ roundNumber: string }>();
  const currentRound = parseInt(roundNumber || '1');

  const gameCode = localStorage.getItem('gameCode');
  const playerId = localStorage.getItem('playerId');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const { game, loading } = useGame(gameCode);
  const [showNoSubmissionNotification, setShowNoSubmissionNotification] = useState(false);
  const [notificationShown, setNotificationShown] = useState(false);

  // Si el juego pasa a active nuevamente, navegar a la nueva ronda
  useEffect(() => {
    if (game && game.state === 'active' && game.currentRound > currentRound) {
      navigate(`/round/${game.currentRound}`);
    }
  }, [game, currentRound, navigate]);

  // Si el juego está completed, ir a End
  useEffect(() => {
    if (game && game.state === 'completed') {
      navigate('/end');
    }
  }, [game, navigate]);

  // Verificar si el jugador no envió y mostrar notificación
  useEffect(() => {
    if (game && playerId && !notificationShown) {
      const leaderboard = getLeaderboardForRound(game, currentRound);
      const playerEntry = leaderboard.find(entry => entry.playerId === playerId);

      if (playerEntry && playerEntry.didNotSubmit) {
        setShowNoSubmissionNotification(true);
        setNotificationShown(true);
      }
    }
  }, [game, playerId, currentRound, notificationShown]);

  const handleAdvance = async () => {
    if (!gameCode || !isAdmin) return;

    try {
      await advanceToNextRound(gameCode);
      // La navegación se hará automáticamente por useEffect
    } catch (error) {
      console.error('Error al avanzar:', error);
      alert('Error al avanzar a la siguiente ronda');
    }
  };

  if (loading || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  const leaderboard = getLeaderboardForRound(game, currentRound);
  const isLastRound = currentRound >= game.totalRounds;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Resultados Ronda {currentRound}
          </h1>
          <p className="text-gray-400">
            {isLastRound ? '¡Última ronda completada!' : `Ronda ${currentRound} de ${game.totalRounds} completada`}
          </p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <LeaderboardComponent
            entries={leaderboard}
            currentPlayerId={playerId || undefined}
          />
        </motion.div>

        {/* Botón avanzar (ADMIN) */}
        {isAdmin && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <button
              onClick={handleAdvance}
              className="primary-button w-full flex items-center justify-center gap-2 text-xl py-4"
            >
              {isLastRound ? (
                <>
                  <Trophy className="w-6 h-6" />
                  Ver Resultados Finales
                </>
              ) : (
                <>
                  <ArrowRight className="w-6 h-6" />
                  Iniciar Ronda {currentRound + 1}
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Mensaje para estudiantes */}
        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center p-6 bg-slate-800/50 rounded-lg"
          >
            <p className="text-gray-300">
              <Loader className="w-5 h-5 inline animate-spin mr-2" />
              Esperando que el profesor{' '}
              {isLastRound ? 'muestre los resultados finales' : 'inicie la siguiente ronda'}...
            </p>
          </motion.div>
        )}
      </div>

      {/* Notificación para jugadores que no enviaron */}
      <NoSubmissionNotification
        show={showNoSubmissionNotification}
        onComplete={() => setShowNoSubmissionNotification(false)}
      />
    </div>
  );
}
