import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Loader, AlertCircle, Play, Users, Pause, Trophy, SkipForward } from 'lucide-react';
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
  const [isPaused, setIsPaused] = useState(false);

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

  // Verificar si el juego fue finalizado (completed), redirigir al podio
  useEffect(() => {
    if (game && game.state === 'completed') {
      navigate('/end');
    }
  }, [game, navigate]);

  // Calcular tiempo de finalización
  const endTime = round?.startTime
    ? round.startTime.toMillis() + (5 * 60 * 1000)
    : Date.now() + (5 * 60 * 1000);

  // Manejar expiración del tiempo (Ya NO auto-procesa, solo notifica)
  const handleTimeExpire = useCallback(async () => {
    // Ya no se auto-procesa al expirar el timer principal
    // Se deja 2 minutos de buffer para que terminen las evaluaciones en progreso
    console.log('Timer principal expirado. Iniciando periodo de gracia de 2 minutos...');
  }, []);

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

  // Forzar finalización del juego (ADMIN)
  const handleForceFinish = async () => {
    if (!gameCode || !isAdmin) return;
    if (!confirm('¿Terminar el juego ahora y mostrar podio final?')) return;

    setProcessing(true);
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');

      await updateDoc(doc(db, 'games', gameCode), {
        state: 'completed',
        updatedAt: new Date()
      });

      navigate('/end');
    } catch (error) {
      console.error('Error al finalizar juego:', error);
      alert('Error al finalizar el juego');
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
                isPaused={isPaused}
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
                    Propuesta de Análisis
                  </label>
                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    placeholder={`Debes incluir:\n• Pregunta de investigación\n• Variables específicas del CEP que usarás (con códigos)\n• Estrategia de cruces y análisis\n• Tipo de gráfico propuesto\n• Mensaje clave / hallazgo esperado\n\nEjemplo:\n"Pregunta: ¿Cómo varía la confianza en Carabineros según experiencia de victimización?\n\nVariables: Usaría la pregunta P47 'Confianza en Carabineros' de CEP 89 (Jul 2024) cruzada con P52 'Victimización en últimos 12 meses', y segmentaría por NSE (variable sociodemográfica).\n\nEstrategia: Compararía el % de confianza alta (mucha + bastante) entre víctimas y no víctimas, desagregado por NSE. También analizaría tendencias temporales usando CEP 88 y 87 para ver si la brecha ha aumentado...\n\nGráfico: Gráfico de barras agrupadas, mostrando niveles de confianza (eje Y) por condición de victimización (eje X), con barras separadas por NSE.\n\nMensaje clave: Esperaría encontrar que las víctimas tienen significativamente menor confianza, especialmente en NSE C3-D, lo que sugiere necesidad de campaña diferenciada por segmento."`}
                    className="input-field w-full h-64 resize-none"
                    disabled={isSubmitting || hasSubmitted}
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Incluye códigos de variables (ej: P47), tipo de gráfico, y cruces específicos
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

                <div className="space-y-3">
                  {/* Pausar/Reanudar Timer */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="primary-button w-full flex items-center justify-center gap-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-5 h-5" />
                        Reanudar Tiempo
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5" />
                        Pausar Tiempo
                      </>
                    )}
                  </button>

                  {/* Procesar Ronda */}
                  <button
                    onClick={handleProcessRound}
                    disabled={processing || submittedCount === 0}
                    className="primary-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <SkipForward className="w-5 h-5" />
                        {allSubmitted ? 'Ir a Resultados (Todos enviaron)' : `Ir a Resultados (${submittedCount}/${activePlayers.length})`}
                      </>
                    )}
                  </button>

                  {/* Finalizar Juego */}
                  <button
                    onClick={handleForceFinish}
                    disabled={processing}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 w-full flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    Terminar Juego (Podio Final)
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-3 text-center">
                  El tiempo pausado permite explicar las variables a los estudiantes
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
