import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JudgeFeedback } from '../types/game';
import { judges } from '../data/judges';

interface JudgeScoreRevealProps {
  feedbacks: JudgeFeedback[];
  onComplete: () => void;
}

export default function JudgeScoreReveal({ feedbacks, onComplete }: JudgeScoreRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Sonidos celebratorios (score > 8)
  const playCelebrationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Secuencia ascendente de tonos
    [600, 750, 900].forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = audioContext.currentTime + (i * 0.15);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    });
  };

  // Sonidos de decepción (score < 4)
  const playDisappointmentSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Secuencia descendente de tonos graves
    [400, 300, 200].forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sawtooth';

      const startTime = audioContext.currentTime + (i * 0.2);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  };

  // Sonido normal para puntajes medios
  const playScoreSound = (score: number) => {
    // Elegir sonido según puntaje
    if (score > 8) {
      playCelebrationSound();
      return;
    }
    if (score < 4) {
      playDisappointmentSound();
      return;
    }

    // Sonido normal para puntajes medios
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequency = 400 + (score * 50);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const playRevealSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  useEffect(() => {
    if (currentIndex < feedbacks.length) {
      // Mostrar nombre del juez
      playRevealSound();

      // Después de 0.3s, mostrar puntaje (¡mucho más rápido!)
      const scoreTimer = setTimeout(() => {
        setShowScore(true);
        playScoreSound(feedbacks[currentIndex].score);
      }, 300);

      // Después de 2s total, pasar al siguiente
      const nextTimer = setTimeout(() => {
        if (currentIndex < feedbacks.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setShowScore(false);
        } else {
          // Último juez, esperar un poco más y completar
          setTimeout(onComplete, 1000);
        }
      }, 2000);

      return () => {
        clearTimeout(scoreTimer);
        clearTimeout(nextTimer);
      };
    }
  }, [currentIndex, feedbacks, onComplete]);

  if (currentIndex >= feedbacks.length) {
    return null;
  }

  const currentFeedback = feedbacks[currentIndex];
  const judgeData = judges.find(j => j.name === currentFeedback.judge);

  // Color basado en puntaje
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'from-green-500 to-emerald-400';
    if (score >= 7) return 'from-blue-500 to-cyan-400';
    if (score >= 5) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-pink-400';
  };

  // Mensajes dramáticos basados en puntaje
  const getDramaticMessage = (score: number): string => {
    if (score >= 9.5) return '¡OBRA MAESTRA!';
    if (score >= 9) return '¡BRILLANTE!';
    if (score >= 8.5) return '¡EXCELENTE!';
    if (score >= 8) return '¡MUY BIEN!';
    if (score >= 7) return 'Sólido';
    if (score >= 6) return 'Bien';
    if (score >= 5) return 'Puede mejorar';
    if (score >= 4) return 'Necesitas repasar';
    if (score >= 3) return 'Preocupante...';
    if (score >= 2) return '¡Ay no!';
    return '¡Estudia más!';
  };

  // Emoji según puntaje
  const getDramaticEmoji = (score: number): string => {
    if (score >= 9) return '🎉';
    if (score >= 8) return '✨';
    if (score >= 7) return '👍';
    if (score >= 5) return '🤔';
    if (score >= 4) return '😕';
    return '😰';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div className="max-w-2xl w-full p-8">
        {/* Contador de jueces */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-gray-400 text-sm">
            Juez {currentIndex + 1} de {feedbacks.length}
          </p>
        </motion.div>

        {/* Tarjeta del juez */}
        <motion.div
          initial={{ scale: 0, rotateY: 180 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="dramatic-card p-12 text-center relative overflow-hidden"
        >
          {/* Brillo de fondo */}
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20"
          />

          {/* Contenido */}
          <div className="relative z-10">
            {/* Emoji del juez */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
              className="text-8xl mb-6"
            >
              {currentFeedback.emoji}
            </motion.div>

            {/* Nombre del juez */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-purple-300 mb-2"
            >
              {currentFeedback.judge}
            </motion.h2>

            {/* Especialidad */}
            {judgeData && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-sm mb-8"
              >
                {judgeData.specialty}
              </motion.p>
            )}

            {/* Puntaje */}
            <AnimatePresence>
              {showScore && (
                <motion.div
                  initial={{ scale: 0, rotateZ: -180 }}
                  animate={{ scale: 1, rotateZ: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="mb-6"
                >
                  <div
                    className={`inline-block px-12 py-8 rounded-2xl bg-gradient-to-br ${getScoreColor(
                      currentFeedback.score
                    )} shadow-2xl`}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 1],
                      }}
                      className="text-7xl font-bold text-white drop-shadow-lg"
                    >
                      {currentFeedback.score.toFixed(1)}
                    </motion.div>

                    {/* Mensaje dramático */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="mt-3 text-white font-bold text-2xl flex items-center justify-center gap-2"
                    >
                      <span>{getDramaticEmoji(currentFeedback.score)}</span>
                      <span>{getDramaticMessage(currentFeedback.score)}</span>
                      <span>{getDramaticEmoji(currentFeedback.score)}</span>
                    </motion.div>
                  </div>

                  {/* Estrellas decorativas */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center gap-2 mt-4"
                  >
                    {Array.from({ length: Math.floor(currentFeedback.score / 2) }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="text-3xl"
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Peso del juez */}
                  {judgeData && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm text-gray-400 mt-4"
                    >
                      Peso: {(judgeData.weight * 100).toFixed(0)}% del puntaje final
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensaje de espera */}
            {!showScore && (
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="text-gray-400 text-lg"
              >
                Evaluando...
              </motion.div>
            )}
          </div>

          {/* Partículas decorativas */}
          {showScore && (
            <>
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: '50%',
                    y: '50%',
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                  }}
                  transition={{
                    duration: 1,
                    delay: Math.random() * 0.3,
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Barra de progreso */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'linear' }}
          className="mt-6 h-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full"
        />
      </div>
    </motion.div>
  );
}
