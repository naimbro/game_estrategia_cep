import { judges } from '../data/judges';

interface JudgesPanelProps {
  currentJudge?: string;
  className?: string;
}

export default function JudgesPanel({ currentJudge, className = '' }: JudgesPanelProps) {
  return (
    <div className={`dramatic-card p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-3 text-purple-300">
        Panel de Jueces Evaluadores
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {judges.map(judge => {
          const isActive = currentJudge === judge.name;

          return (
            <div
              key={judge.name}
              className={`judge-card text-center ${
                isActive ? 'ring-2 ring-cyan-400 animate-pulse-slow' : ''
              }`}
            >
              <div className="text-4xl mb-2">{judge.emoji}</div>
              <h4 className="font-bold text-sm text-cyan-200">{judge.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{judge.specialty}</p>
              <p className="text-xs text-purple-400 mt-2">
                Peso: {(judge.weight * 100).toFixed(0)}%
              </p>
              {isActive && (
                <p className="text-xs text-cyan-400 mt-2 font-semibold animate-pulse">
                  Evaluando...
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
        <p className="text-xs text-gray-400">
          <strong className="text-purple-300">Criterios de evaluación:</strong> Los jueces
          evalúan según su especialidad. El puntaje final es un promedio ponderado de todas
          las evaluaciones.
        </p>
      </div>
    </div>
  );
}
