import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface NoSubmissionNotificationProps {
  show: boolean;
  onComplete: () => void;
}

export default function NoSubmissionNotification({
  show,
  onComplete
}: NoSubmissionNotificationProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!show) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateZ: -10 }}
          animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative max-w-lg w-full bg-gradient-to-br from-red-900 to-orange-900 p-8 rounded-2xl border-4 border-red-500 shadow-2xl"
        >
          {/* Icono de advertencia */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <AlertTriangle className="w-24 h-24 text-yellow-400" strokeWidth={2} />
              </motion.div>

              {/* Pulso de advertencia */}
              <motion.div
                className="absolute inset-0 bg-yellow-400 rounded-full opacity-30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              />
            </div>
          </motion.div>

          {/* Mensaje */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¡No Enviaste tu Propuesta!
            </h2>
            <p className="text-xl text-gray-200 mb-4">
              Se te asignó el puntaje mínimo
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
              className="inline-flex items-center justify-center w-32 h-32 bg-red-600 rounded-full border-4 border-white shadow-lg mb-4"
            >
              <span className="text-6xl font-bold text-white">1</span>
            </motion.div>
            <p className="text-lg text-gray-300">
              Recuerda enviar tu propuesta a tiempo en la próxima ronda
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span>Continuando en</span>
              <motion.span
                key={countdown}
                initial={{ scale: 1.5, color: '#ffffff' }}
                animate={{ scale: 1, color: '#d1d5db' }}
                className="text-2xl font-bold"
              >
                {countdown}
              </motion.span>
              <span>segundos...</span>
            </div>
          </motion.div>

          {/* Botón cerrar manual */}
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Cerrar"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
