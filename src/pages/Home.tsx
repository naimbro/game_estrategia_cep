import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Users, Trophy, Play, LogIn, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, loginWithGoogle, isAdmin } from '../lib/firebase';
import { User } from 'firebase/auth';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const userIsAdmin = user?.email ? isAdmin(user.email) : false;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header principal */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-16 h-16 text-purple-400 animate-pulse-slow" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Analista en Modo Crisis
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Pon a prueba tu capacidad analítica enfrentando escenarios realistas de política
            pública. Diseña preguntas de investigación y estrategias de análisis con datos del CEP.
          </p>
        </motion.div>

        {/* Tarjeta de características */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="dramatic-card p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">
            ¿Cómo funciona?
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4">
              <div className="shrink-0">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">10 Escenarios Realistas</h3>
                <p className="text-sm text-gray-400">
                  Enfrenta desafíos basados en casos reales de política pública en Chile.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">4 Jueces Expertos IA</h3>
                <p className="text-sm text-gray-400">
                  Clara Datos, Analytikos, Insighta y Narrativo evaluarán tus propuestas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <Brain className="w-8 h-8 text-pink-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Datos Reales del CEP</h3>
                <p className="text-sm text-gray-400">
                  Accede a 100+ variables del Centro de Estudios Públicos de Chile.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-2">Feedback Educativo</h3>
                <p className="text-sm text-gray-400">
                  Recibe evaluaciones detalladas y sugerencias para mejorar tu análisis.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <h4 className="font-semibold text-purple-300 mb-2">Objetivo pedagógico:</h4>
            <p className="text-sm text-gray-300">
              Este juego desarrolla tu capacidad para formular <strong>preguntas analíticas</strong> y
              diseñar <strong>estrategias de investigación</strong> con datos de encuestas. Aprenderás a:
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1 ml-4">
              <li>✓ Identificar variables relevantes para un problema</li>
              <li>✓ Formular preguntas respondibles empíricamente</li>
              <li>✓ Diseñar comparaciones y cruces significativos</li>
              <li>✓ Comunicar hallazgos potenciales a audiencias no expertas</li>
            </ul>
          </div>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-4"
        >
          {/* Info del usuario admin */}
          {userIsAdmin && user && (
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold">{user.displayName || 'Admin'}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* Botón Crear Sala - solo para admins autenticados */}
            {userIsAdmin ? (
              <button
                onClick={() => navigate('/create')}
                className="primary-button flex items-center justify-center gap-2 text-xl px-8 py-4"
              >
                <Users className="w-6 h-6" />
                Crear Sala (Profesor)
              </button>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-6 h-6" />
                {loading ? 'Iniciando sesión...' : 'Login con Google (Profesor)'}
              </button>
            )}

            {/* Botón Unirse - siempre disponible */}
            <button
              onClick={() => navigate('/join')}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/50"
            >
              <Play className="w-6 h-6" />
              Unirse a Sala (Estudiante)
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Desarrollado como herramienta educativa • Datos del Centro de Estudios Públicos (CEP)
        </motion.p>
      </div>
    </div>
  );
}
