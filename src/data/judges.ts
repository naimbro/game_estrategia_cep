import { Judge } from '../types/game';

// Definición de los 4 jueces evaluadores
export const judges: Judge[] = [
  {
    name: "Leopoldo Cerros",
    emoji: "🎩",
    specialty: "rigor metodológico y validez de variables CEP",
    weight: 0.25,
    role: "Director del Centro de Estudios Públicos",
    personality: "Riguroso, metodológico, defensor de la ciencia de datos"
  },
  {
    name: "Carolina Tohó",
    emoji: "🏛️",
    specialty: "utilidad política y accionabilidad",
    weight: 0.25,
    role: "Ministra del Interior",
    personality: "Pragmática, orientada a decisiones concretas"
  },
  {
    name: "Daniel Matabuena",
    emoji: "📺",
    specialty: "claridad comunicacional y narrativa",
    weight: 0.25,
    role: "Periodista de investigación",
    personality: "Directo, busca el titular, valora la claridad"
  },
  {
    name: "Profe Naim",
    emoji: "📊",
    specialty: "visualización de datos y diseño gráfico",
    weight: 0.25,
    role: "Experto en visualización de datos",
    personality: "Educador, obsesionado con gráficos claros"
  }
];
