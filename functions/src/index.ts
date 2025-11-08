import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Interfaces (copiadas de tu proyecto)
interface Judge {
  name: string;
  emoji: string;
  specialty: string;
  weight: number;
}

interface JudgeFeedback {
  judge: string;
  emoji: string;
  score: number;
  feedback: string;
  suggestedVariables?: string[];
}

interface Scenario {
  id: number;
  title: string;
  category: string;
  text: string;
}

// Jueces (copiados de src/data/judges.ts)
const judges: Judge[] = [
  {
    name: 'Clara Datos',
    emoji: '📊',
    specialty: 'Claridad y formulación de preguntas',
    weight: 0.20
  },
  {
    name: 'Analytikos',
    emoji: '🔬',
    specialty: 'Coherencia analítica y selección de variables',
    weight: 0.35
  },
  {
    name: 'Insighta',
    emoji: '💡',
    specialty: 'Originalidad y potencial de hallazgos',
    weight: 0.25
  },
  {
    name: 'Narrativo',
    emoji: '📝',
    specialty: 'Impacto comunicacional y relevancia pública',
    weight: 0.20
  }
];

// Variables CEP (simplificadas - en producción cargarías el JSON completo)
const buildVariablesContext = (): string => {
  return `Tienes acceso a más de 100 variables del CEP (Centro de Estudios Públicos de Chile) sobre temas como: confianza institucional, salud, educación, economía, política, medio ambiente, etc.`;
};

const buildSystemPrompt = (judgeSpecialty: string): string => {
  return `Eres un juez experto del juego educativo "Analista en Modo Crisis". Tu especialidad es: ${judgeSpecialty}.

${buildVariablesContext()}

Tu tarea es evaluar propuestas de análisis de datos del Centro de Estudios Públicos (CEP) de Chile.

INSTRUCCIONES DE EVALUACIÓN:
1. Asigna un puntaje de 1 a 10 (acepta decimales como 8.5)
2. Proporciona feedback educativo específico (2-4 oraciones)
3. Si detectas problemas con las variables (no existen, años incorrectos, etc.), menciónalos
4. Sugiere variables alternativas o complementarias cuando sea pertinente
5. Mantén un tono constructivo y pedagógico

FORMATO DE RESPUESTA (JSON estricto):
{
  "score": <número entre 1 y 10>,
  "feedback": "<tu evaluación en 2-4 oraciones>",
  "suggestedVariables": ["<código_variable1>", "<código_variable2>"]
}

IMPORTANTE: Responde SOLO con el JSON, sin texto adicional.`;
};

const buildJudgePrompt = (
  judgeName: string,
  scenario: Scenario,
  proposal: string,
  selectedVariables: string[]
): string => {
  const prompts: { [key: string]: string } = {
    'Clara Datos': `
Evalúa la CLARIDAD y FORMULACIÓN de esta propuesta:

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES SELECCIONADAS: ${selectedVariables.join(', ') || 'ninguna'}

Evalúa:
- ¿La propuesta incluye una pregunta clara y específica?
- ¿Es una pregunta respondible con datos de encuesta?
- ¿Está bien delimitada (temporalidad, población, variables)?
- ¿El lenguaje es claro y sin ambigüedades?
- ¿Se describe cómo abordaría el análisis?
`,
    'Analytikos': `
Evalúa la COHERENCIA ANALÍTICA y SELECCIÓN DE VARIABLES:

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES SELECCIONADAS: ${selectedVariables.join(', ') || 'ninguna'}

Evalúa:
- ¿Las variables propuestas son coherentes con el escenario?
- ¿La estrategia analítica es coherente con la pregunta planteada?
- ¿Las variables elegidas son apropiadas para responder la pregunta?
- ¿Se mencionan comparaciones, cruces o desagregaciones pertinentes?
- ¿Falta alguna variable clave obvia?
`,
    'Insighta': `
Evalúa la ORIGINALIDAD y POTENCIAL DE HALLAZGOS:

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES SELECCIONADAS: ${selectedVariables.join(', ') || 'ninguna'}

Evalúa:
- ¿La pregunta es interesante y no trivial?
- ¿Podría generar insights novedosos o sorprendentes?
- ¿Va más allá de descripciones simples?
- ¿Explora relaciones o patrones no obvios?
- ¿Tiene potencial para desafiar intuiciones o revelar tendencias ocultas?
`,
    'Narrativo': `
Evalúa el IMPACTO COMUNICACIONAL y RELEVANCIA PÚBLICA:

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES SELECCIONADAS: ${selectedVariables.join(', ') || 'ninguna'}

Evalúa:
- ¿La propuesta es relevante para el debate público actual?
- ¿Los hallazgos potenciales serían comunicables a audiencias no expertas?
- ¿Abordan una necesidad real del tomador de decisiones del escenario?
- ¿Los resultados podrían informar políticas concretas?
- ¿La narrativa conecta datos con problemas reales?
`
  };

  return prompts[judgeName] || prompts['Clara Datos'];
};

// Función para evaluar con OpenAI
async function evaluateWithJudge(
  judge: Judge,
  scenario: Scenario,
  proposal: string,
  selectedVariables: string[],
  apiKey: string
): Promise<JudgeFeedback> {

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(judge.specialty)
          },
          {
            role: 'user',
            content: buildJudgePrompt(judge.name, scenario, proposal, selectedVariables)
          }
        ],
        temperature: 0.6,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return {
      judge: judge.name,
      emoji: judge.emoji,
      score: Math.max(1, Math.min(10, result.score)),
      feedback: result.feedback,
      suggestedVariables: result.suggestedVariables || []
    };
  } catch (error) {
    console.error(`Error evaluando con ${judge.name}:`, error);

    // Fallback en caso de error
    return {
      judge: judge.name,
      emoji: judge.emoji,
      score: 5,
      feedback: 'No pude evaluar esta respuesta debido a un error técnico. Por favor, intenta de nuevo.',
      suggestedVariables: []
    };
  }
}

// Cloud Function principal
export const evaluateSubmission = functions
  .https.onCall(async (data, context) => {
  // Verificar que el usuario está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Debes estar autenticado para usar esta función'
    );
  }

  // Validar datos de entrada
  const { scenario, proposal, selectedVariables } = data;

  if (!scenario || !proposal) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Faltan datos requeridos'
    );
  }

  // Verificar que el usuario está en un juego activo
  const db = admin.firestore();
  const gamesSnapshot = await db.collection('games')
    .where(`players.${context.auth.uid}.isActive`, '==', true)
    .limit(1)
    .get();

  if (gamesSnapshot.empty) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'No estás en un juego activo'
    );
  }

  try {
    const allFeedback: JudgeFeedback[] = [];
    // Obtener API key (emulador local usa .env, producción usa functions.config)
    const apiKey = process.env.FUNCTIONS_EMULATOR === 'true'
      ? process.env.OPENAI_API_KEY
      : functions.config().openai.key;

    // Evaluar con cada juez secuencialmente
    for (const judge of judges) {
      const feedback = await evaluateWithJudge(
        judge,
        scenario,
        proposal,
        selectedVariables || [],
        apiKey
      );
      allFeedback.push(feedback);
    }

    // Calcular puntajes
    const totalScore = allFeedback.reduce((sum, f) => sum + f.score, 0) / allFeedback.length;
    const weightedScore = allFeedback.reduce((sum, f, index) => {
      return sum + (f.score * judges[index].weight);
    }, 0);

    return {
      feedback: allFeedback,
      totalScore: Math.round(totalScore * 10) / 10,
      weightedScore: Math.round(weightedScore * 10) / 10
    };
  } catch (error) {
    console.error('Error en evaluación:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error al procesar la evaluación'
    );
  }
});
