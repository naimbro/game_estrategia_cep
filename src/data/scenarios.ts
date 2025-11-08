import { Scenario } from '../types/game';

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "La Paradoja de Carabineros",
    text: "Marzo 2024. El Director General de Carabineros enfrenta una crisis: las cifras de victimización están bajando según la Subsecretaría de Prevención del Delito, pero la confianza en Carabineros está en mínimos históricos. Necesita entender si las víctimas de delitos confían menos en la institución, y si esto varía por nivel socioeconómico. Tu análisis será presentado mañana al Presidente.",
    category: "Seguridad y Justicia",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo varía la confianza en Carabineros según experiencia de victimización y nivel socioeconómico?",
      variables_esperadas: [
        "p47_confianza_carabineros",
        "p50_percepcion_seguridad",
        "nse"
      ],
      cruces_esperados: [
        "Confianza en Carabineros x Victimización",
        "Confianza en Carabineros x NSE",
        "Interacción victimización x NSE"
      ],
      graficos_apropiados: [
        "Gráfico de barras agrupadas (confianza por victimización, separado por NSE)",
        "Línea de tiempo de confianza en Carabineros (2003-2024)"
      ],
      insights_clave: [
        "Brecha entre víctimas y no víctimas varía según NSE",
        "NSE C3-D-E muestran mayor desconfianza post-victimización",
        "Tendencia histórica muestra caída acelerada post-estallido social"
      ],
      errores_comunes_a_penalizar: [
        "No mencionar códigos específicos de variables CEP",
        "No proponer cruces o desagregaciones",
        "No especificar tipo de gráfico",
        "Ignorar variable NSE como moderador"
      ]
    }
  },
  {
    id: 2,
    title: "El Enigma del Rechazo Constitucional",
    text: "5 de septiembre 2022, día después del plebiscito. El comando del Apruebo está en shock: perdieron por 62%-38%. La coordinadora de campaña te llama desesperada: necesita entender QUÉ salió mal. ¿Fue la polarización política? ¿La desconfianza en instituciones? ¿El miedo al cambio? Tienes datos CEP hasta julio 2022 y necesitas un análisis rápido para la reunión del comando.",
    category: "Política e Instituciones",
    respuesta_ideal: {
      pregunta_investigacion: "¿Qué factores predijeron el rechazo a la propuesta constitucional de 2022?",
      variables_esperadas: [
        "p90_apoyo_proceso_constituyente",
        "p91_expectativas_constitucion",
        "p15_confianza_instituciones",
        "p10_aprobacion_gobierno"
      ],
      cruces_esperados: [
        "Apoyo/Rechazo x Expectativas de mejora",
        "Apoyo/Rechazo x Confianza en instituciones",
        "Apoyo/Rechazo x Aprobación gobierno Boric"
      ],
      graficos_apropiados: [
        "Stacked bar chart (intención de voto por expectativas de mejora)",
        "Scatter plot (correlación confianza institucional vs apoyo a nueva constitución)"
      ],
      insights_clave: [
        "Quienes esperaban empeoramiento votaron masivamente Rechazo",
        "Baja confianza en Convención predijo Rechazo",
        "Aprobación gobierno correlaciona fuertemente con voto"
      ],
      errores_comunes_a_penalizar: [
        "Usar variables que no existían en julio 2022",
        "No considerar la temporalidad (datos previos al plebiscito)",
        "No proponer análisis multivariado o cruces"
      ]
    }
  },
  {
    id: 3,
    title: "El Fantasma del COVID",
    text: "Noviembre 2020, segunda ola de COVID. El Ministro de Salud Enrique Paris enfrenta resistencia a las cuarentenas. ¿La población está más preocupada por contagiarse o por la economía? ¿Confían en el manejo gubernamental? Y lo más importante: ¿quiénes están más asustados y quiénes más escépticos? Necesitas segmentar para diseñar mensajes comunicacionales diferenciados.",
    category: "Salud y Sistema de Salud",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo varía la preocupación por COVID-19 y confianza en el manejo gubernamental según nivel socioeconómico y edad?",
      variables_esperadas: [
        "p85_covid19_preocupacion",
        "p86_confianza_manejo_covid",
        "p70_economia_personal",
        "nse",
        "edad"
      ],
      cruces_esperados: [
        "Preocupación COVID x NSE",
        "Confianza manejo x Situación económica personal",
        "Preocupación COVID x Edad"
      ],
      graficos_apropiados: [
        "Heatmap (preocupación por NSE y edad)",
        "Gráfico de barras apiladas (confianza en manejo por situación económica)"
      ],
      insights_clave: [
        "NSE ABC1 más preocupado por salud, D-E por economía",
        "Adultos mayores más preocupados pero menos críticos del manejo",
        "Quienes reportan economía \"mala\" tienen menor confianza en manejo"
      ],
      errores_comunes_a_penalizar: [
        "No segmentar por variables sociodemográficas",
        "Ignorar trade-off salud vs economía",
        "No proponer gráfico que muestre interacciones"
      ]
    }
  },
  {
    id: 4,
    title: "La Crisis de la Inflación",
    text: "Julio 2024. La inflación acumulada ha devastado los bolsillos. El Ministro de Hacienda necesita saber: ¿quiénes están sufriendo más? ¿Cómo se relaciona esto con la percepción de desigualdad? ¿Y con la aprobación del gobierno? Tienes 3 horas para un informe que se presentará en La Moneda.",
    category: "Economía y Empleo",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo varía la preocupación por inflación según situación económica del hogar y cómo esto afecta la aprobación gubernamental?",
      variables_esperadas: [
        "p93_inflacion_preocupacion",
        "p70_economia_personal",
        "p80_desigualdad_ingresos",
        "p10_aprobacion_gobierno",
        "nse"
      ],
      cruces_esperados: [
        "Preocupación inflación x Situación económica hogar",
        "Percepción desigualdad x NSE",
        "Aprobación gobierno x Preocupación inflación"
      ],
      graficos_apropiados: [
        "Gráfico de barras (preocupación inflación por situación económica)",
        "Scatter plot con línea de regresión (aprobación gobierno vs preocupación inflación)"
      ],
      insights_clave: [
        "Hogares con economía \"mala/muy mala\" muestran 95%+ de preocupación alta",
        "Percepción de desigualdad injusta aumentó en todos los NSE",
        "Aprobación gobierno cae drásticamente entre quienes están \"muy preocupados\""
      ],
      errores_comunes_a_penalizar: [
        "No conectar situación económica con aprobación política",
        "Ignorar heterogeneidad por NSE",
        "No proponer visualización de correlación"
      ]
    }
  },
  {
    id: 5,
    title: "El Dilema de las AFP",
    text: "2016. El movimiento No+AFP llena las calles. El gobierno de Bachelet está considerando una reforma al sistema de pensiones, pero no sabe qué tan extendido está el descontento. ¿Es transversal o focalizado? ¿Se relaciona con percepción de desigualdad? Tu análisis podría cambiar el rumbo de la reforma más importante de la década.",
    category: "Economía y Empleo",
    respuesta_ideal: {
      pregunta_investigacion: "¿Qué tan extendida está la insatisfacción con el sistema de pensiones y cómo se relaciona con percepción de desigualdad y nivel socioeconómico?",
      variables_esperadas: [
        "p82_sistema_pensiones_satisfaccion",
        "p80_desigualdad_ingresos",
        "nse",
        "edad"
      ],
      cruces_esperados: [
        "Satisfacción AFP x NSE",
        "Satisfacción AFP x Edad",
        "Satisfacción AFP x Percepción desigualdad"
      ],
      graficos_apropiados: [
        "Stacked bar (satisfacción/insatisfacción por NSE)",
        "Gráfico de barras agrupadas (satisfacción AFP por percepción desigualdad)"
      ],
      insights_clave: [
        "Insatisfacción es transversal (todos los NSE >70%)",
        "NSE C3-D-E tienen insatisfacción cercana al 90%",
        "Quienes perciben desigualdad como \"muy injusta\" rechazan AFP masivamente"
      ],
      errores_comunes_a_penalizar: [
        "No desagregar por edad (futuros vs actuales pensionados)",
        "Ignorar relación con percepción de desigualdad",
        "No cuantificar qué tan transversal es el rechazo"
      ]
    }
  },
  {
    id: 6,
    title: "Generación Ansiedad",
    text: "Julio 2024. La Ministra de Salud ve cifras alarmantes de salud mental post-pandemia. Necesita entender: ¿quiénes reportan más tristeza/desesperanza? ¿Se relaciona con satisfacción general de vida? ¿Con situación económica? El Presidente quiere un programa focalizado, pero no hay presupuesto para todos. Tu análisis decidirá a quién ayudar primero.",
    category: "Salud y Sistema de Salud",
    respuesta_ideal: {
      pregunta_investigacion: "¿Qué grupos poblacionales reportan peor salud mental y cómo se relaciona esto con satisfacción de vida y situación económica?",
      variables_esperadas: [
        "p92_salud_mental",
        "p1_satisfaccion_general",
        "p70_economia_personal",
        "nse",
        "edad",
        "sexo"
      ],
      cruces_esperados: [
        "Salud mental x NSE",
        "Salud mental x Edad",
        "Salud mental x Sexo",
        "Salud mental x Situación económica",
        "Satisfacción vida x Salud mental"
      ],
      graficos_apropiados: [
        "Heatmap (frecuencia tristeza por edad y NSE)",
        "Scatter plot (satisfacción vida vs días con tristeza)"
      ],
      insights_clave: [
        "Mujeres jóvenes (18-29) reportan peores indicadores",
        "NSE D-E con economía \"mala\" tienen sintomatología crítica",
        "Correlación muy fuerte entre salud mental y satisfacción de vida"
      ],
      errores_comunes_a_penalizar: [
        "No segmentar por múltiples variables demográficas",
        "Ignorar interseccionalidad (ej: mujeres jóvenes de NSE bajo)",
        "No proponer priorización basada en datos"
      ]
    }
  },
  {
    id: 7,
    title: "El Espejismo de la Migración",
    text: "Octubre 2023. El debate migratorio está al rojo vivo. Un diputado asegura que \"la inmigración arruinó el país\". Otro dice \"es puro racismo y miedo\". Un medio serio te pide un análisis objetivo: ¿qué piensan realmente los chilenos? ¿Todos opinan igual o hay diferencias importantes? Tu reportaje podría bajar la temperatura del debate... o subirla.",
    category: "Valores y Cultura",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo varía la opinión sobre inmigración según nivel socioeconómico, edad y percepción de seguridad?",
      variables_esperadas: [
        "p94_migracion_opinion",
        "p50_percepcion_seguridad",
        "nse",
        "edad",
        "zona (urbano/rural)"
      ],
      cruces_esperados: [
        "Opinión migración x NSE",
        "Opinión migración x Percepción seguridad",
        "Opinión migración x Edad"
      ],
      graficos_apropiados: [
        "Gráfico de barras apiladas (opinión por NSE)",
        "Gráfico de barras agrupadas (opinión por percepción seguridad)"
      ],
      insights_clave: [
        "Quienes se sienten inseguros tienen opinión más negativa",
        "NSE C3-D-E más críticos que ABC1",
        "Adultos mayores más negativos que jóvenes"
      ],
      errores_comunes_a_penalizar: [
        "No conectar con percepción de seguridad",
        "Ignorar heterogeneidad por NSE/edad",
        "No matizar el \"consenso\" anti-inmigración"
      ]
    }
  },
  {
    id: 8,
    title: "El Narco Toca la Puerta",
    text: "Junio 2025. El narcotráfico se transformó en el tema #1 de preocupación ciudadana. La Ministra Tohá necesita focalizar recursos policiales: ¿en qué comunas? ¿Qué grupos están más preocupados? ¿Cómo se relaciona con percepción general de seguridad? El plan se lanza en 2 semanas y tu análisis definirá el despliegue policial.",
    category: "Seguridad y Justicia",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo varía la preocupación por narcotráfico según zona geográfica y cómo se relaciona con percepción general de seguridad?",
      variables_esperadas: [
        "p95_narcotrafico_preocupacion",
        "p50_percepcion_seguridad",
        "p47_confianza_carabineros",
        "zona",
        "region"
      ],
      cruces_esperados: [
        "Preocupación narcotráfico x Zona (urbano/rural)",
        "Preocupación narcotráfico x Región",
        "Preocupación narcotráfico x Percepción seguridad barrio",
        "Confianza Carabineros x Preocupación narcotráfico"
      ],
      graficos_apropiados: [
        "Mapa coroplético (preocupación por región)",
        "Scatter plot (percepción inseguridad vs preocupación narco)"
      ],
      insights_clave: [
        "Zonas urbanas reportan mayor preocupación que rurales",
        "Fuerte correlación entre inseguridad barrio y preocupación narco",
        "Baja confianza en Carabineros donde hay alta preocupación narco"
      ],
      errores_comunes_a_penalizar: [
        "No proponer segmentación geográfica",
        "Ignorar relación con confianza en Carabineros",
        "No mencionar visualización geográfica (mapa)"
      ]
    }
  }
];
