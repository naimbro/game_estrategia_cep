import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Loader, ArrowLeft } from 'lucide-react';
import { loginAnonymously } from '../lib/firebase';
import { joinGame } from '../lib/gameLogic';

export default function JoinGame() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!studentName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!gameCode.trim()) {
      setError('Por favor ingresa el código del juego');
      return;
    }

    if (gameCode.trim().length !== 6) {
      setError('El código debe tener 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Login anónimo
      const user = await loginAnonymously();

      // Unirse al juego
      await joinGame(gameCode.trim().toUpperCase(), user.uid, studentName.trim());

      // Guardar en localStorage
      localStorage.setItem('gameCode', gameCode.trim().toUpperCase());
      localStorage.setItem('playerName', studentName.trim());
      localStorage.setItem('playerId', user.uid);
      localStorage.setItem('isAdmin', 'false');

      // Ir a waiting room
      navigate(`/waiting/${gameCode.trim().toUpperCase()}`);
    } catch (err: any) {
      console.error('Error al unirse al juego:', err);
      setError(err.message || 'Error al unirse al juego. Verifica el código.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full mb-4">
              <UserPlus className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Unirse a Sala
            </h1>
            <p className="text-gray-400">
              Ingresa el código que te dio tu profesor
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="gameCode" className="block text-sm font-semibold text-purple-300 mb-2">
                Código del Juego
              </label>
              <input
                id="gameCode"
                type="text"
                value={gameCode}
                onChange={(e) => {
                  setGameCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="Ej: ABC123"
                className="input-field w-full text-lg text-center tracking-widest font-mono"
                maxLength={6}
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="studentName" className="block text-sm font-semibold text-purple-300 mb-2">
                Tu nombre
              </label>
              <input
                id="studentName"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleJoin();
                  }
                }}
                placeholder="Ej: María González"
                className="input-field w-full text-lg"
                maxLength={50}
                disabled={loading}
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
              onClick={handleJoin}
              disabled={loading || !studentName.trim() || !gameCode.trim()}
              className="primary-button w-full flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uniéndose...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Unirse al Juego
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-gray-400">
              <strong className="text-purple-300">Nota:</strong> El código es de 6 caracteres.
              Espera en la sala hasta que el profesor inicie la primera ronda.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
