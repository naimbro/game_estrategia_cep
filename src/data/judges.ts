import { Judge } from '../types/game';

// Definición de los 4 jueces evaluadores
export const judges: Judge[] = [
  {
    name: "Clara Datos",
    emoji: "🧮",
    specialty: "claridad y formulación de preguntas",
    weight: 0.20
  },
  {
    name: "Analytikos",
    emoji: "🧩",
    specialty: "coherencia analítica y selección de variables",
    weight: 0.35
  },
  {
    name: "Insighta",
    emoji: "💡",
    specialty: "originalidad y potencial de hallazgos",
    weight: 0.25
  },
  {
    name: "Narrativo",
    emoji: "🎭",
    specialty: "impacto comunicacional y relevancia pública",
    weight: 0.20
  }
];
