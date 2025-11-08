import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Loader, AlertCircle, Play, Users } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { getScenarioForRound, submitRoundSubmission, processRound, allPlayersSubmitted } from '../lib/gameLogic';
import { evaluateSubmission } from '../lib/openaiJudges';
import { JudgeFeedback } from '../types/game';
import Timer from '../components/Timer';
import VariableExplorer from '../components/VariableExplorer';
import JudgesPanel from '../components/JudgesPanel';
import JudgeScoreReveal from '../components/JudgeScoreReveal';
import JudgeFeedbackDisplay from '../components/JudgeFeedbackDisplay';

export default function Round() {
  const navigate = useNavigate();
  const { roundNumber } = useParams<{ roundNumber: string }>();
  const currentRound = parseInt(roundNumber || '1');

  const gameCode = localStorage.getItem('gameCode');
  const playerId = localStorage.getItem('playerId');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const { game, loading: gameLoading } = useGame(gameCode);

  const [proposal, setProposal] = useState('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentJudge, setCurrentJudge] = useState<string | undefined>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [evaluationFeedbacks, setEvaluationFeedbacks] = useState<JudgeFeedback[] | null>(null);
  const [showScoreReveal, setShowScoreReveal] = useState(false);

  const scenario = getScenarioForRound(currentRound);
  const round = game?.rounds[currentRound];

  // Verificar si ya envió respuesta
  useEffect(() => {
    if (round && playerId && round.submissions[playerId]) {
      setHasSubmitted(true);
    }
  }, [round, playerId]);

  // Verificar si el juego pasó a results, redirigir
  useEffect(() => {
    if (game && game.state === 'results') {
      navigate(`/results/${currentRound}`);
    }
  }, [game, currentRound, navigate]);

  // Calcular tiempo de finalización
  const endTime = round?.startTime
    ? round.startTime.toMillis() + (3 * 60 * 1000)
    : Date.now() + (3 * 60 * 1000);

  // Manejar expiración del tiempo (AUTO-PROCESS si es admin)
  const handleTimeExpire = useCallback(async () => {
    if (isAdmin && game && gameCode && !processing) {
      await handleProcessRound();
    }
  }, [isAdmin, game, gameCode, processing]);

  // Agregar variable
  const handleVariableSelect = (variableCode: string) => {
    if (!selectedVariables.includes(variableCode)) {
      setSelectedVariables([...selectedVariables, variableCode]);
    }
  };

  // Remover variable
  const handleVariableRemove = (variableCode: string) => {
    setSelectedVariables(selectedVariables.filter(v => v !== variableCode));
  };

  // Enviar respuesta
  const handleSubmit = async () => {
    if (!gameCode || !playerId || hasSubmitted) return;

    if (!proposal.trim()) {
      alert('Por favor describe tu propuesta de análisis');
      return;
    }

    setIsSubmitting(true);

    try {
      // Evaluar con jueces IA
      const result = await evaluateSubmission(
        scenario,
        proposal,
        selectedVariables,
        (_judgeIndex, judgeName) => {
          setCurrentJudge(judgeName);
        }
      );

      // Mostrar animación de puntajes
      setEvaluationFeedbacks(result.feedback);
      setShowScoreReveal(true);
      setCurrentJudge(undefined);

    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      alert('Error al procesar tu respuesta. Por favor intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  // Completar envío después de mostrar puntajes
  const handleScoreRevealComplete = async () => {
    setShowScoreReveal(false);

    if (!gameCode || !playerId || !evaluationFeedbacks) return;

    try {
      // Calcular puntajes finales
      const totalScore = evaluationFeedbacks.reduce((sum, f) => sum + f.score, 0) / evaluationFeedbacks.length;
      const judges = await import('../data/judges');
      const weightedScore = evaluationFeedbacks.reduce((sum, f, index) => {
        return sum + (f.score * judges.judges[index].weight);
      }, 0);

      // Guardar en Firestore
      await submitRoundSubmission(gameCode, currentRound, playerId, {
        proposal,
        selectedVariables,
        feedback: evaluationFeedbacks,
        totalScore: Math.round(totalScore * 10) / 10,
        weightedScore: Math.round(weightedScore * 10) / 10
      });

      setHasSubmitted(true);

    } catch (error) {
      console.error('Error al guardar respuesta:', error);
      alert('Error al guardar tu respuesta. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Procesar ronda (ADMIN)
  const handleProcessRound = async () => {
    if (!gameCode || !isAdmin) return;

    setProcessing(true);
    try {
      await processRound(gameCode, currentRound);
      // La navegación a results se hará automáticamente por el useEffect
    } catch (error) {
      console.error('Error al procesar ronda:', error);
      alert('Error al procesar la ronda');
      setProcessing(false);
    }
  };

  if (gameLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando partida...</p>
        </div>
      </div>
    );
  }

  if (!game || !round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">No se pudo cargar la ronda.</p>
          <button onClick={() => navigate('/')} className="primary-button">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const players = Object.values(game.players);
  const activePlayers = players.filter(p => p.isActive);
  const submittedCount = Object.keys(round.submissions).length;
  const allSubmitted = allPlayersSubmitted(game, currentRound);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header con progreso */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Ronda {currentRound} de {game.totalRounds}
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {submittedCount}/{activePlayers.length} jugadores enviaron respuesta
              </p>
            </div>
            {round.isActive && (
              <Timer
                endTime={endTime}
                onExpire={handleTimeExpire}
              />
            )}
          </div>

          {/* Barra de progreso */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentRound / game.totalRounds) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-600"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Escenario */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="dramatic-card p-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🔍</span>
                <div>
                  <h2 className="text-xl font-bold text-purple-300">
                    {scenario.title}
                  </h2>
                  <span className="text-xs text-gray-500 uppercase">
                    {scenario.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {scenario.text}
              </p>
            </motion.div>

            {/* Inputs de respuesta */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="dramatic-card p-6"
            >
              <h3 className="text-lg font-bold text-purple-300 mb-4">
                Tu Propuesta de Análisis
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Describe tu propuesta de análisis
                  </label>
                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder="Describe tu pregunta de investigación y estrategia de análisis. Por ejemplo: '¿Cómo ha evolucionado la confianza en el sistema de salud público entre 2010 y 2023? Usaría las variables de confianza institucional y salud, comparando por grupos socioeconómicos y regiones...'"
                    className="input-field w-full h-48 resize-none"
                    disabled={isSubmitting || hasSubmitted}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Incluye: pregunta de investigación, variables a usar, comparaciones o cruces relevantes
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || hasSubmitted}
                  className="primary-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      {currentJudge ? `Evaluando con ${currentJudge}...` : 'Procesando...'}
                    </>
                  ) : hasSubmitted ? (
                    'Respuesta enviada ✓'
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Respuesta
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Feedback de los jueces (después de enviar) */}
            {hasSubmitted && evaluationFeedbacks && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="dramatic-card p-6"
              >
                <JudgeFeedbackDisplay feedbacks={evaluationFeedbacks} />
              </motion.div>
            )}

            {/* Controles de admin */}
            {isAdmin && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="dramatic-card p-6 bg-yellow-900/20 border-yellow-500/30"
              >
                <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
                  👑 Controles de Profesor
                </h3>
                <button
                  onClick={handleProcessRound}
                  disabled={processing || submittedCount === 0}
                  className="primary-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Procesando ronda...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {allSubmitted ? 'Procesar Ronda (Todos enviaron)' : `Procesar Ronda (${submittedCount}/${activePlayers.length})`}
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  También se procesa automáticamente cuando expira el tiempo
                </p>
              </motion.div>
            )}
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Panel de jueces */}
            <JudgesPanel currentJudge={isSubmitting ? currentJudge : undefined} />

            {/* Explorador de variables */}
            <VariableExplorer
              selectedVariables={selectedVariables}
              onVariableSelect={handleVariableSelect}
              onVariableRemove={handleVariableRemove}
            />
          </div>
        </div>
      </div>

      {/* Revelación de puntajes */}
      {showScoreReveal && evaluationFeedbacks && (
        <JudgeScoreReveal
          feedbacks={evaluationFeedbacks}
          onComplete={handleScoreRevealComplete}
        />
      )}
    </div>
  );
}
