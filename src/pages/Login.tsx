import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Loader, ArrowLeft } from 'lucide-react';
import { loginAnonymously } from '../lib/firebase';
import { createGame } from '../lib/gameLogic';

export default function Login() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!playerName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Login anónimo en Firebase
      const user = await loginAnonymously();

      // Crear nueva partida
      const gameId = await createGame(user.uid, playerName.trim());

      // Guardar en localStorage para persistencia
      localStorage.setItem('gameId', gameId);
      localStorage.setItem('playerName', playerName.trim());
      localStorage.setItem('playerId', user.uid);

      // Navegar a la primera ronda
      navigate(`/round/1`);
    } catch (err) {
      console.error('Error al iniciar partida:', err);
      setError('Error al crear la partida. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Botón volver */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </motion.button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="dramatic-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
              <UserCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Comienza tu Partida
            </h1>
            <p className="text-gray-400">
              Ingresa tu nombre para empezar a analizar
            </p>
          </div>

          {/* Formulario */}
          <div className="space-y-6">
            <div>
              <label htmlFor="playerName" className="block text-sm font-semibold text-purple-300 mb-2">
                Tu nombre
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleStart();
                  }
                }}
                placeholder="Ej: María González"
                className="input-field w-full text-lg"
                maxLength={50}
                disabled={loading}
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              onClick={handleStart}
              disabled={loading || !playerName.trim()}
              className="primary-button w-full flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creando partida...
                </>
              ) : (
                <>
                  Iniciar Juego
                </>
              )}
            </button>
          </div>

          {/* Info adicional */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-gray-400">
              <strong className="text-purple-300">Nota:</strong> Tu partida se guardará automáticamente.
              Tendrás 10 rondas para demostrar tus habilidades analíticas enfrentando diferentes
              escenarios de política pública.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
