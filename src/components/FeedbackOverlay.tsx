import { motion, AnimatePresence } from 'framer-motion';
import { JudgeFeedback } from '../types/game';
import { Trophy, Star, ArrowRight } from 'lucide-react';

interface FeedbackOverlayProps {
  isOpen: boolean;
  feedback: JudgeFeedback[];
  totalScore: number;
  weightedScore: number;
  onContinue: () => void;
}

export default function FeedbackOverlay({
  isOpen,
  feedback,
  totalScore,
  weightedScore,
  onContinue
}: FeedbackOverlayProps) {
  // Determinar nivel de desempeño
  const getPerformanceLevel = (score: number) => {
    if (score >= 9) return { text: 'Excelente', color: 'from-yellow-600 to-yellow-400', emoji: '🏆' };
    if (score >= 7.5) return { text: 'Muy Bueno', color: 'from-purple-600 to-purple-400', emoji: '⭐' };
    if (score >= 6) return { text: 'Bueno', color: 'from-blue-600 to-blue-400', emoji: '👍' };
    if (score >= 4.5) return { text: 'Regular', color: 'from-gray-600 to-gray-400', emoji: '📊' };
    return { text: 'Mejorable', color: 'from-red-600 to-red-400', emoji: '💪' };
  };

  const performance = getPerformanceLevel(weightedScore);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-4xl w-full bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl shadow-2xl border-2 border-purple-500/30 p-8 my-8"
          >
            {/* Header con puntaje */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${performance.color} rounded-full mb-4 text-5xl`}
              >
                {performance.emoji}
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {performance.text}
              </h2>
              <div className="flex items-center justify-center gap-4 text-xl">
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">
                    Puntaje Final: <strong className="text-white">{weightedScore.toFixed(1)}</strong>/10
                  </span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-purple-400" />
                  <span className="text-gray-300">
                    Promedio: <strong className="text-white">{totalScore.toFixed(1)}</strong>/10
                  </span>
                </div>
              </div>
            </div>

            {/* Feedback de jueces */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-purple-300 mb-4">
                Evaluaciones de los Jueces
              </h3>
              {feedback.map((judge, index) => (
                <motion.div
                  key={judge.judge}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="judge-card"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl shrink-0">{judge.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-cyan-200">{judge.judge}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-lg font-bold text-white">
                            {judge.score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {judge.feedback}
                      </p>
                      {judge.suggestedVariables && judge.suggestedVariables.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-purple-300 font-semibold mb-1">
                            Variables sugeridas:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {judge.suggestedVariables.map(variable => (
                              <span
                                key={variable}
                                className="px-2 py-1 bg-purple-900/50 text-purple-200 rounded text-xs"
                              >
                                {variable}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Botón continuar */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={onContinue}
              className="primary-button w-full flex items-center justify-center gap-2 text-lg"
            >
              Continuar a siguiente ronda
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
