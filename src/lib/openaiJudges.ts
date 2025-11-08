import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import { JudgeFeedback, Scenario } from '../types/game';

// Evaluar con todos los jueces usando Cloud Function
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
    const evaluateFunc = httpsCallable(functions, 'evaluateSubmission');

    const result = await evaluateFunc({
      scenario,
      proposal,
      selectedVariables
    });

    const data = result.data as {
      feedback: JudgeFeedback[];
      totalScore: number;
      weightedScore: number;
    };

    return data;
  } catch (error) {
    console.error('Error al evaluar con Cloud Function:', error);
    throw new Error('Error al procesar la evaluación');
  }
}
