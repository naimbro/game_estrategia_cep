import { JudgeFeedback, Scenario } from '../types/game';
import { judges } from '../data/judges';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Evaluar con todos los jueces usando Firebase Cloud Function
export async function evaluateSubmission(
  scenario: Scenario,
  proposal: string,
  selectedVariables: string[],
  onProgress?: (judgeIndex: number, judgeName: string) => void
): Promise<{
  feedback: JudgeFeedback[];
  totalScore: number;
  weightedScore: number;
}> {
  try {
    // Obtener referencia a la función
    const evaluateFunction = httpsCallable(functions, 'evaluateSubmission');

    // Simular progreso mientras llamamos a la función
    if (onProgress) {
      judges.forEach((judge, index) => {
        setTimeout(() => onProgress(index, judge.name), index * 500);
      });
    }

    // Llamar a la Cloud Function
    const result = await evaluateFunction({
      scenario,
      proposal,
      selectedVariables
    });

    return result.data as {
      feedback: JudgeFeedback[];
      totalScore: number;
      weightedScore: number;
    };
  } catch (error) {
    console.error('Error al evaluar con Cloud Function:', error);
    throw new Error('Error al procesar la evaluación. Por favor intenta de nuevo.');
  }
}
