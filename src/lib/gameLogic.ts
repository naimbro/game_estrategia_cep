import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Game, Player, GameRound, Submission, LeaderboardEntry } from '../types/game';
import { scenarios } from '../data/scenarios';

const TOTAL_ROUNDS = 8;
const ROUND_DURATION_MS = 3 * 60 * 1000; // 3 minutos

// Generar código único de 6 caracteres
function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin I, O, 0, 1 para evitar confusión
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Crear nuevo juego (ADMIN)
export async function createGame(adminId: string, adminName: string): Promise<string> {
  const gameCode = generateGameCode();

  const adminPlayer: Player = {
    uid: adminId,
    name: adminName,
    isAdmin: true,
    isActive: true,
    joinedAt: Timestamp.now(),
    totalScore: 0,
    averageScore: 0,
    completedRounds: 0
  };

  // Inicializar rondas vacías
  const rounds: { [key: number]: GameRound } = {};
  for (let i = 1; i <= TOTAL_ROUNDS; i++) {
    rounds[i] = {
      roundNumber: i,
      scenarioId: scenarios[i - 1].id,
      isActive: false,
      submissions: {}
    };
  }

  const game: Game = {
    gameCode,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    currentRound: 0, // Empieza en 0 = waiting room
    totalRounds: TOTAL_ROUNDS,
    state: 'waiting',
    players: {
      [adminId]: adminPlayer
    },
    rounds
  };

  await setDoc(doc(db, 'games', gameCode), game);

  return gameCode;
}

// Unirse a juego (ESTUDIANTE)
export async function joinGame(gameCode: string, userId: string, userName: string): Promise<void> {
  const gameRef = doc(db, 'games', gameCode);
  const gameDoc = await getDoc(gameRef);

  if (!gameDoc.exists()) {
    throw new Error('Código de juego inválido');
  }

  const game = gameDoc.data() as Game;

  if (game.state !== 'waiting') {
    throw new Error('El juego ya comenzó');
  }

  const player: Player = {
    uid: userId,
    name: userName,
    isAdmin: false,
    isActive: true,
    joinedAt: Timestamp.now(),
    totalScore: 0,
    averageScore: 0,
    completedRounds: 0
  };

  await updateDoc(gameRef, {
    [`players.${userId}`]: player,
    updatedAt: Timestamp.now()
  });
}

// Obtener juego
export async function getGame(gameCode: string): Promise<Game | null> {
  const gameDoc = await getDoc(doc(db, 'games', gameCode));

  if (!gameDoc.exists()) {
    return null;
  }

  return gameDoc.data() as Game;
}

// Iniciar ronda (ADMIN)
export async function startRound(gameCode: string, roundNumber: number): Promise<void> {
  const gameRef = doc(db, 'games', gameCode);

  await updateDoc(gameRef, {
    currentRound: roundNumber,
    state: 'active',
    [`rounds.${roundNumber}.isActive`]: true,
    [`rounds.${roundNumber}.startTime`]: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
}

// Enviar respuesta de jugador
export async function submitRoundSubmission(
  gameCode: string,
  roundNumber: number,
  playerId: string,
  submission: Omit<Submission, 'timestamp'>
): Promise<void> {
  const gameRef = doc(db, 'games', gameCode);

  const completeSubmission: Submission = {
    ...submission,
    timestamp: Timestamp.now()
  };

  await updateDoc(gameRef, {
    [`rounds.${roundNumber}.submissions.${playerId}`]: completeSubmission,
    updatedAt: Timestamp.now()
  });
}

// Procesar ronda y calcular resultados (ADMIN)
export async function processRound(gameCode: string, roundNumber: number): Promise<void> {
  const game = await getGame(gameCode);
  if (!game) return;

  const round = game.rounds[roundNumber];
  const results: { [key: string]: { totalScore: number; weightedScore: number; rank: number; didNotSubmit?: boolean } } = {};

  // Obtener todos los jugadores activos
  const activePlayers = Object.values(game.players).filter(p => p.isActive);

  // Calcular scores para jugadores que enviaron
  const scores = Object.entries(round.submissions).map(([playerId, submission]) => ({
    playerId,
    totalScore: submission.totalScore || 0,
    weightedScore: submission.weightedScore || 0,
    didNotSubmit: false
  }));

  // Agregar jugadores que NO enviaron con puntaje de 1
  activePlayers.forEach(player => {
    const hasSubmission = round.submissions[player.uid];
    if (!hasSubmission) {
      scores.push({
        playerId: player.uid,
        totalScore: 1,
        weightedScore: 1,
        didNotSubmit: true
      });
    }
  });

  // Ordenar por puntaje
  scores.sort((a, b) => b.weightedScore - a.weightedScore);

  // Asignar ranks
  scores.forEach((score, index) => {
    results[score.playerId] = {
      totalScore: score.totalScore,
      weightedScore: score.weightedScore,
      rank: index + 1,
      didNotSubmit: score.didNotSubmit
    };
  });

  // Actualizar totales de jugadores
  const updates: any = {
    [`rounds.${roundNumber}.results`]: results,
    [`rounds.${roundNumber}.isActive`]: false,
    [`rounds.${roundNumber}.endTime`]: Timestamp.now(),
    state: 'results',
    updatedAt: Timestamp.now()
  };

  // Actualizar scores de cada jugador (incluyendo los que no enviaron)
  Object.entries(results).forEach(([playerId, result]) => {
    const currentTotal = game.players[playerId].totalScore;
    const newTotal = currentTotal + result.weightedScore;
    const newAverage = newTotal / roundNumber;

    updates[`players.${playerId}.totalScore`] = newTotal;
    updates[`players.${playerId}.averageScore`] = newAverage;
    updates[`players.${playerId}.completedRounds`] = roundNumber;
  });

  await updateDoc(doc(db, 'games', gameCode), updates);
}

// Avanzar a siguiente ronda (ADMIN)
export async function advanceToNextRound(gameCode: string): Promise<void> {
  const game = await getGame(gameCode);
  if (!game) return;

  const nextRound = game.currentRound + 1;

  if (nextRound > TOTAL_ROUNDS) {
    // Juego completado
    await updateDoc(doc(db, 'games', gameCode), {
      state: 'completed',
      updatedAt: Timestamp.now()
    });
  } else {
    // Siguiente ronda
    await startRound(gameCode, nextRound);
  }
}

// Obtener leaderboard de una ronda
export function getLeaderboardForRound(game: Game, roundNumber: number): LeaderboardEntry[] {
  const round = game.rounds[roundNumber];
  if (!round.results) return [];

  const entries: LeaderboardEntry[] = Object.entries(round.results).map(([playerId, result]) => {
    const player = game.players[playerId];
    return {
      playerId,
      playerName: player.name,
      roundScore: result.weightedScore,
      totalScore: player.totalScore,
      averageScore: player.averageScore,
      rank: result.rank,
      didNotSubmit: result.didNotSubmit
    };
  });

  return entries.sort((a, b) => a.rank - b.rank);
}

// Verificar si todos los jugadores enviaron respuesta
export function allPlayersSubmitted(game: Game, roundNumber: number): boolean {
  const round = game.rounds[roundNumber];
  const activePlayers = Object.values(game.players).filter(p => p.isActive);
  const submissions = Object.keys(round.submissions);

  return activePlayers.every(player => submissions.includes(player.uid));
}

// Calcular tiempo restante de ronda
export function getRoundTimeRemaining(round: GameRound): number {
  if (!round.isActive || !round.startTime) {
    return 0;
  }

  const startTime = round.startTime.toMillis();
  const endTime = startTime + ROUND_DURATION_MS;
  const now = Date.now();

  return Math.max(0, endTime - now);
}

// Obtener escenario de una ronda
export function getScenarioForRound(roundNumber: number) {
  return scenarios[roundNumber - 1] || scenarios[0];
}
