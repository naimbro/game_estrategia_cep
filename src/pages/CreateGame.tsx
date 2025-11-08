import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Loader, ArrowLeft } from 'lucide-react';
import { auth, isAdmin } from '../lib/firebase';
import { createGame } from '../lib/gameLogic';
import { User } from 'firebase/auth';

export default function CreateGame() {
  const navigate = useNavigate();
  const [professorName, setProfessorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verificar autenticación y permisos de admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser || !currentUser.email || !isAdmin(currentUser.email)) {
        // No autenticado o no es admin → redirigir a home
        navigate('/');
      } else {
        setUser(currentUser);
        // Pre-llenar el nombre con el del usuario de Google
        setProfessorName(currentUser.displayName || '');
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleCreate = async () => {
    if (!user) {
      setError('No estás autenticado');
      return;
    }

    if (!professorName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear juego con el usuario autenticado de Google
      const gameCode = await createGame(user.uid, professorName.trim());

      // Guardar en localStorage
      localStorage.setItem('gameCode', gameCode);
      localStorage.setItem('playerName', professorName.trim());
      localStorage.setItem('playerId', user.uid);
      localStorage.setItem('isAdmin', 'true');

      // Ir a waiting room
      navigate(`/waiting/${gameCode}`);
    } catch (err) {
      console.error('Error al crear juego:', err);
      setError('Error al crear el juego. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  // Mostrar loading mientras se verifica autenticación
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Crear Sala de Juego
            </h1>
            <p className="text-gray-400">
              Como profesor, crea una sala para tus estudiantes
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="professorName" className="block text-sm font-semibold text-purple-300 mb-2">
                Tu nombre (Profesor)
              </label>
              <input
                id="professorName"
                type="text"
                value={professorName}
                onChange={(e) => {
                  setProfessorName(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleCreate();
                  }
                }}
                placeholder="Ej: Profesor García"
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
              onClick={handleCreate}
              disabled={loading || !professorName.trim()}
              className="primary-button w-full flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Creando sala...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Crear Sala
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <p className="text-xs text-gray-400">
              <strong className="text-purple-300">Nota:</strong> Recibirás un código de 6 dígitos
              que tus estudiantes usarán para unirse. Controlarás el inicio de cada ronda.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
