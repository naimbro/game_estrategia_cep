import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Game } from '../types/game';

export function useGame(gameCode: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameCode) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Suscribirse a cambios en tiempo real
    const unsubscribe = onSnapshot(
      doc(db, 'games', gameCode),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setGame(docSnapshot.data() as Game);
          setError(null);
        } else {
          setGame(null);
          setError('Juego no encontrado');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to game:', err);
        setError('Error al cargar el juego');
        setLoading(false);
      }
    );

    // Cleanup
    return () => unsubscribe();
  }, [gameCode]);

  return { game, loading, error };
}
