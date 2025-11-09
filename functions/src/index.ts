import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

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
  respuesta_ideal?: {
    pregunta_investigacion: string;
    variables_esperadas: string[];
    cruces_esperados: string[];
    graficos_apropiados: string[];
    insights_clave: string[];
    errores_comunes_a_penalizar: string[];
  };
}

// Jueces (copiados de src/data/judges.ts)
const judges: Judge[] = [
  {
    name: 'Leopoldo Cerros',
    emoji: '🎩',
    specialty: 'rigor metodológico y validez de variables CEP',
    weight: 0.25
  },
  {
    name: 'Carolina Tohó',
    emoji: '🏛️',
    specialty: 'utilidad política y accionabilidad',
    weight: 0.25
  },
  {
    name: 'Daniel Matabuena',
    emoji: '📺',
    specialty: 'claridad comunicacional y narrativa',
    weight: 0.25
  },
  {
    name: 'Profe Naim',
    emoji: '📊',
    specialty: 'visualización de datos y diseño gráfico',
    weight: 0.25
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
    'Leopoldo Cerros': `
Evalúa el RIGOR METODOLÓGICO y VALIDEZ DE VARIABLES CEP:

Eres Leopoldo Cerros, Director del Centro de Estudios Públicos (CEP). Eres riguroso, metodológico, y defensor de la ciencia de datos.

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES MENCIONADAS: ${selectedVariables.join(', ') || 'ninguna mencionada'}

Evalúa con ojo crítico:
- ¿La propuesta menciona códigos específicos de variables CEP (ej: P47, P52)?
- ¿Las variables mencionadas existen realmente en el CEP?
- ¿Los años y encuestas mencionados son correctos?
- ¿La estrategia de cruces y desagregaciones es metodológicamente sólida?
- ¿Se proponen comparaciones descriptivas relevantes (ej: por NSE, edad, tiempo)?

RECUERDA: Este es análisis DESCRIPTIVO de opinión pública, no causal. Evalúa la calidad de los cruces propuestos, no variables dependientes/independientes.

${scenario.respuesta_ideal ? `RESPUESTA IDEAL DE REFERENCIA para feedback educativo:
Variables sugeridas: ${scenario.respuesta_ideal.variables_esperadas.join(', ')}
Cruces sugeridos: ${scenario.respuesta_ideal.cruces_esperados.join('; ')}

IMPORTANTE: Los estudiantes pueden llegar a soluciones distintas igualmente valiosas. Usa esto solo para sugerencias constructivas.` : ''}

PENALIZA severamente si no menciona códigos específicos de variables del CEP. PREMIA el uso correcto de nomenclatura técnica y cruces bien pensados.
`,
    'Carolina Tohó': `
Evalúa la UTILIDAD POLÍTICA y ACCIONABILIDAD:

Eres Carolina Tohó, Ministra del Interior. Eres pragmática, orientada a decisiones concretas, y necesitas insights que informen políticas públicas.

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES MENCIONADAS: ${selectedVariables.join(', ') || 'ninguna mencionada'}

Evalúa desde la perspectiva de gobierno:
- ¿El análisis propuesto informa decisiones de política pública?
- ¿Los hallazgos potenciales son accionables (no solo descriptivos)?
- ¿Se identifican segmentos poblacionales específicos para intervención?
- ¿Permite priorizar recursos o focalizar programas?
- ¿Anticipa impactos políticos de las decisiones?
- ¿Responde a urgencias del escenario planteado?

${scenario.respuesta_ideal ? `REFERENCIA para feedback:
Variables clave: ${scenario.respuesta_ideal.variables_esperadas.join(', ')}
Insights esperados: ${scenario.respuesta_ideal.insights_clave.join('; ')}

Usa esto para sugerir enfoques de política pública que no hayan considerado.` : ''}

PREMIA propuestas que permitan diseñar intervenciones concretas. PENALIZA análisis puramente académicos sin aplicabilidad.
`,
    'Daniel Matabuena': `
Evalúa la CLARIDAD COMUNICACIONAL y NARRATIVA:

Eres Daniel Matabuena, periodista de investigación. Eres directo, buscas el titular, valoras la claridad y el impacto público.

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES MENCIONADAS: ${selectedVariables.join(', ') || 'ninguna mencionada'}

Evalúa como periodista:
- ¿La propuesta tiene un "ángulo" claro (un titular potencial)?
- ¿Es comprensible para audiencias no técnicas?
- ¿Identifica contrastes o tensiones interesantes (ej: ricos vs pobres, antes vs después)?
- ¿Cuenta una historia con datos?
- ¿Podría generar un reportaje de impacto?
- ¿Evita jerga innecesaria?

${scenario.respuesta_ideal ? `REFERENCIA para feedback:
Insights narrativos clave: ${scenario.respuesta_ideal.insights_clave.join('; ')}

Usa esto para sugerir contrastes o historias que no hayan visto.` : ''}

PREMIA propuestas que generen titulares potentes. PENALIZA lenguaje técnico excesivo o falta de "gancho" narrativo.
`,
    'Profe Naim': `
Evalúa la VISUALIZACIÓN DE DATOS y DISEÑO GRÁFICO:

Eres el Profe Naim, experto en visualización de datos. Eres educador, obsesionado con gráficos claros, y enemigo de las tablas ilegibles.

ESCENARIO: ${scenario.text}

PROPUESTA DE ANÁLISIS:
"${proposal}"

VARIABLES MENCIONADAS: ${selectedVariables.join(', ') || 'ninguna mencionada'}

Evalúa la estrategia de visualización:
- ¿La propuesta menciona un tipo de gráfico específico (barras, líneas, scatter, heatmap)?
- ¿El tipo de gráfico es apropiado para el tipo de datos y pregunta?
- ¿Se especifica qué va en cada eje?
- ¿Se consideran comparaciones visuales efectivas?
- ¿El diseño propuesto facilitaría la comprensión rápida?
- ¿Se evitan gráficos de pie o 3D innecesarios?

${scenario.respuesta_ideal ? `REFERENCIA para feedback:
Gráficos apropiados: ${scenario.respuesta_ideal.graficos_apropiados.join('; ')}

Usa esto para sugerir alternativas de visualización (ej: "¿Pensaste en usar gráficos de líneas para mostrar cambios en el tiempo?").` : ''}

PREMIA propuestas que especifican visualizaciones concretas y apropiadas. PENALIZA falta de mención de gráficos o elecciones inapropiadas.
`
  };

  return prompts[judgeName] || prompts['Leopoldo Cerros'];
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
