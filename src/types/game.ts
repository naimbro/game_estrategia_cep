import { Timestamp } from 'firebase/firestore';

// Respuesta ideal por escenario (para evaluación de jueces)
export interface IdealResponse {
  pregunta_investigacion: string;
  variables_esperadas: string[];
  cruces_esperados: string[];
  graficos_apropiados: string[];
  insights_clave: string[];
  errores_comunes_a_penalizar: string[];
}

// Escenario narrativo para cada ronda
export interface Scenario {
  id: number;
  title: string;
  text: string;
  category: string;
  respuesta_ideal?: IdealResponse;
}

// Variable del diccionario CEP
export interface CEPVariable {
  code: string;
  name: string;
  category: string;
  encuestas: Array<{
    numero: number;
    periodo: string;
    pregunta_exacta: string;
    opciones: string[];
    tipo: 'ordinal' | 'categórica' | 'numérica';
  }>;
  tags: string[];
  variables_relacionadas: string[];
  years: [number, number];
  es_serie_temporal?: boolean;
  description?: string;
}

// Juez evaluador
export interface Judge {
  name: string;
  emoji: string;
  specialty: string;
  weight: number;
  role?: string;
  personality?: string;
}

// Feedback de un juez
export interface JudgeFeedback {
  judge: string;
  emoji: string;
  score: number;
  feedback: string;
  suggestedVariables?: string[];
}

// Respuesta del jugador en una ronda
export interface Submission {
  proposal: string;
  selectedVariables: string[];
  timestamp: Timestamp;
  feedback?: JudgeFeedback[];
  totalScore?: number;
  weightedScore?: number;
}

// Datos del jugador en el juego
export interface Player {
  uid: string;
  name: string;
  isAdmin: boolean;
  isActive: boolean;
  joinedAt: Timestamp;
  totalScore: number;
  averageScore: number;
  completedRounds: number;
}

// Ronda del juego (MULTIPLAYER)
export interface GameRound {
  roundNumber: number;
  scenarioId: number;
  startTime?: Timestamp;
  endTime?: Timestamp;
  isActive: boolean;
  submissions: {
    [playerId: string]: Submission;
  };
  results?: {
    [playerId: string]: {
      totalScore: number;
      weightedScore: number;
      rank: number;
    };
  };
}

// Estado del juego multiplayer
export type GameState = 'waiting' | 'active' | 'results' | 'completed';

// Juego multiplayer completo
export interface Game {
  gameCode: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  currentRound: number;
  totalRounds: number;
  state: GameState;
  players: {
    [userId: string]: Player;
  };
  rounds: {
    [roundNumber: number]: GameRound;
  };
}

// Entrada del leaderboard (después de cada ronda)
export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  roundScore: number;
  totalScore: number;
  averageScore: number;
  rank: number;
  didNotSubmit?: boolean;
}

// Estado de evaluación
export interface EvaluationState {
  isEvaluating: boolean;
  currentJudge?: string;
  progress: number;
}
