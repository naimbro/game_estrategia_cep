import { motion } from 'framer-motion';
import { JudgeFeedback } from '../types/game';
import { MessageSquare, Star } from 'lucide-react';

interface JudgeFeedbackDisplayProps {
  feedbacks: JudgeFeedback[];
  className?: string;
}

export default function JudgeFeedbackDisplay({ feedbacks, className = '' }: JudgeFeedbackDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-400 border-green-500/30 bg-green-900/20';
    if (score >= 7) return 'text-blue-400 border-blue-500/30 bg-blue-900/20';
    if (score >= 5) return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20';
    return 'text-red-400 border-red-500/30 bg-red-900/20';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.5) return 'bg-gradient-to-br from-green-500 to-emerald-400';
    if (score >= 7) return 'bg-gradient-to-br from-blue-500 to-cyan-400';
    if (score >= 5) return 'bg-gradient-to-br from-yellow-500 to-orange-400';
    return 'bg-gradient-to-br from-red-500 to-pink-400';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-purple-300">Feedback de los Jueces</h3>
      </div>

      {feedbacks.map((feedback, index) => (
        <motion.div
          key={feedback.judge}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border ${getScoreColor(feedback.score)}`}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{feedback.emoji}</span>
              <div>
                <h4 className="font-bold text-white">{feedback.judge}</h4>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-lg ${getScoreBadgeColor(feedback.score)} flex items-center gap-1`}>
              <Star className="w-4 h-4 text-white fill-white" />
              <span className="font-bold text-white">{feedback.score.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {feedback.feedback}
          </p>

          {feedback.suggestedVariables && feedback.suggestedVariables.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">💡 Variables sugeridas:</p>
              <div className="flex flex-wrap gap-2">
                {feedback.suggestedVariables.map((variable) => (
                  <span
                    key={variable}
                    className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded text-xs text-purple-300"
                  >
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Resumen de puntaje */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: feedbacks.length * 0.1 + 0.2 }}
        className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-300 font-semibold">Puntaje Promedio</span>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-bold text-white">
              {(feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length).toFixed(1)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
