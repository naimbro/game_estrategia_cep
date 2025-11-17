import { Scenario } from '../types/game';

export const scenarios: Scenario[] = [
  {
    id: 1,
    title: "La Brecha de Género Electoral",
    text: "17 de noviembre, 2025, un día después de la primera vuelta presidencial. El jefe de campaña de José Antonio Kast te llama urgente: los números muestran que perdieron por 15 puntos entre mujeres pero ganaron por 8 entre hombres. Para segunda vuelta necesitan entender: ¿qué temas importan más a las mujeres que votaron por Jara? ¿Hay diferencias por edad o NSE? ¿Pueden captar mujeres moderadas? Tienes hasta mañana para presentar al comando.",
    category: "Campaña Electoral - Segunda Vuelta",
    respuesta_ideal: {
      pregunta_investigacion: "¿Qué temas prioritarios y características sociodemográficas explican la brecha de género en intención de voto entre Kast y Jara?",
      variables_esperadas: [
        "p1_problema_mas_importante",
        "p20_intencion_voto_presidencial",
        "p45_opinion_aborto",
        "p62_percepcion_desigualdad_genero",
        "sexo",
        "edad",
        "nse"
      ],
      cruces_esperados: [
        "Intención de voto x Sexo",
        "Problema más importante x Sexo x Intención de voto",
        "Opinión aborto x Sexo x Intención de voto",
        "Intención de voto x Sexo x Edad",
        "Intención de voto x Sexo x NSE"
      ],
      graficos_apropiados: [
        "Gráfico de barras agrupadas (intención voto por sexo, segmentado por NSE)",
        "Heatmap (temas prioritarios por sexo y edad)",
        "Stacked bar (distribución de voto femenino por grupo etario)"
      ],
      insights_clave: [
        "Mujeres priorizan pensiones, salud y educación vs seguridad en hombres",
        "Brecha de género mayor en mujeres jóvenes (18-35) que adultas mayores",
        "Mujeres NSE C2-C3 son segmento más persuadible para Kast",
        "Opinión sobre aborto y derechos reproductivos correlaciona fuertemente con voto femenino"
      ],
      errores_comunes_a_penalizar: [
        "No segmentar mujeres por edad y NSE (no son homogéneas)",
        "Ignorar diferencias temáticas entre hombres y mujeres",
        "No proponer segmento específico persuadible",
        "No usar variables de valores/actitudes además de demográficas"
      ]
    }
  },
  {
    id: 2,
    title: "El Mapa de la Victoria",
    text: "18 de noviembre, 2025. La coordinadora territorial de campaña de Jeanette Jara tiene un problema: recursos limitados para segunda vuelta. Debe decidir dónde invertir en publicidad, eventos y militancia territorial. ¿En qué regiones/comunas hay más votantes persuadibles vs voto duro? ¿Dónde movilizar abstencionistas vs dónde persuadir indecisos? Tu análisis definirá el mapa de inversión de $500 millones.",
    category: "Campaña Electoral - Segunda Vuelta",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo varía el potencial de persuasión y movilización electoral por región y cómo priorizar inversión territorial de campaña?",
      variables_esperadas: [
        "p20_intencion_voto_presidencial",
        "p21_certeza_voto",
        "p22_posibilidad_cambiar_voto",
        "p23_voto_primera_vuelta",
        "region",
        "zona_urbano_rural",
        "nse"
      ],
      cruces_esperados: [
        "Intención de voto x Certeza x Región",
        "Abstención primera vuelta x Intención voto segunda vuelta x Región",
        "Votantes persuadibles (baja certeza) x Región x NSE",
        "Diferencia resultados primera vuelta vs intención segunda vuelta x Región"
      ],
      graficos_apropiados: [
        "Mapa coroplético (% votantes persuadibles por región)",
        "Scatter plot (abstención 1ra vuelta vs intención voto 2da vuelta, por región)",
        "Gráfico de barras (regiones ordenadas por potencial de crecimiento Jara)"
      ],
      insights_clave: [
        "Regiones RM, Valparaíso y Biobío tienen mayor % de indecisos persuadibles",
        "Regiones del norte tienen alta abstención movilizable pro-Jara",
        "Zonas urbanas NSE C2-C3 muestran mayor volatilidad de voto",
        "Regiones del sur requieren estrategia defensiva (consolidar voto duro)"
      ],
      errores_comunes_a_penalizar: [
        "No diferenciar entre persuasión (indecisos) y movilización (abstencionistas)",
        "Ignorar certeza de voto como indicador de persuabilidad",
        "No proponer priorización territorial específica",
        "No considerar resultados de primera vuelta como baseline"
      ]
    }
  },
  {
    id: 3,
    title: "El Fantasma de la Abstención",
    text: "19 de noviembre, 2025. Los analistas están preocupados: 32% de abstención en primera vuelta, la más alta en democracia. Un think tank progresista te encarga entender: ¿quiénes son los que no votaron? ¿Son más de izquierda, derecha o apolíticos? ¿Se pueden movilizar para segunda vuelta? ¿Qué los motivaría a votar? El informe se publica en 48 horas y podría cambiar las estrategias de campaña.",
    category: "Campaña Electoral - Segunda Vuelta",
    respuesta_ideal: {
      pregunta_investigacion: "¿Qué perfil sociodemográfico y político tienen los abstencionistas de primera vuelta y qué factores podrían movilizarlos en segunda vuelta?",
      variables_esperadas: [
        "p23_voto_primera_vuelta",
        "p24_razon_no_voto",
        "p20_intencion_voto_segunda_vuelta",
        "p25_probabilidad_votar_segunda_vuelta",
        "p5_interes_politica",
        "p10_identificacion_politica",
        "edad",
        "nse",
        "sexo",
        "nivel_educacional"
      ],
      cruces_esperados: [
        "Perfil abstencionistas (edad, NSE, educación) vs votantes",
        "Razón de no voto x NSE x Edad",
        "Identificación política x Participación primera vuelta",
        "Probabilidad votar segunda vuelta x Razón no voto primera vuelta",
        "Intención voto segunda vuelta entre abstencionistas x NSE"
      ],
      graficos_apropiados: [
        "Pirámide poblacional comparativa (votantes vs abstencionistas)",
        "Sankey diagram (flujo de abstencionistas 1ra vuelta a intención 2da vuelta)",
        "Gráfico de barras (razones de no voto por grupo etario)"
      ],
      insights_clave: [
        "Abstencionistas son principalmente jóvenes 18-29 (52%) y NSE D-E (38%)",
        "Principal razón: desinterés/desconfianza política (45%), no razones logísticas",
        "30% de abstencionistas declara intención de votar en segunda vuelta",
        "Abstencionistas movilizables se inclinan levemente hacia Jara (52%-48%)"
      ],
      errores_comunes_a_penalizar: [
        "No distinguir entre abstención por desinterés vs obstáculos logísticos",
        "Asumir que abstencionistas no tienen preferencia política",
        "Ignorar heterogeneidad de abstencionistas (no son grupo homogéneo)",
        "No cuantificar potencial de movilización real"
      ]
    }
  },
  {
    id: 4,
    title: "El Primer Proyecto del Diputado",
    text: "20 de noviembre, 2025. Acabas de ser electa diputada por el Distrito 7 (Valparaíso-Quillota) y debes definir tu primer proyecto de ley para marcar agenda. Tu asesora te presenta 3 opciones: rebaja tarifas transporte público, protección humedales costeros, o reforma al sistema de pensiones. Necesitas datos: ¿qué preocupa más a tu distrito vs el país? ¿En qué tema puedes tener más impacto político? Presentas mañana en tu bancada.",
    category: "Agenda Legislativa Parlamentarios",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo difieren las prioridades ciudadanas entre la Región de Valparaíso y el nivel nacional, y qué tema genera mayor potencial de impacto legislativo?",
      variables_esperadas: [
        "p1_problema_mas_importante",
        "p2_problema_mas_importante_segundo",
        "p70_situacion_economica_hogar",
        "p82_opinion_sistema_pensiones",
        "p88_preocupacion_medioambiente",
        "region",
        "zona_urbano_rural"
      ],
      cruces_esperados: [
        "Problema más importante x Región (Valparaíso vs resto del país)",
        "Ranking de problemas Región Valparaíso vs Nacional",
        "Preocupación transporte x Zona (urbano Valparaíso vs rural)",
        "Situación económica hogar x Problema prioritario (Valparaíso)",
        "Intensidad preocupación pensiones x Edad (Valparaíso)"
      ],
      graficos_apropiados: [
        "Gráfico de barras comparativas (top 5 problemas Valparaíso vs Nacional)",
        "Diverging bar chart (diferencia % prioridad Valparaíso - Nacional por tema)",
        "Heatmap (intensidad preocupación por tema y grupo etario en Valparaíso)"
      ],
      insights_clave: [
        "Pensiones es tema #1 en Valparaíso (38%) vs #2 nacional (29%)",
        "Valparaíso muestra preocupación medioambiental 8pts sobre media nacional",
        "Transporte público prioritario solo en zonas urbanas (12% urbano vs 3% rural)",
        "Población 50+ de Valparaíso tiene intensidad excepcional en tema pensiones (82%)"
      ],
      errores_comunes_a_penalizar: [
        "No comparar distrito/región con nivel nacional",
        "Ignorar diferencias urbano-rural dentro de la región",
        "No segmentar por edad cuando es relevante (ej: pensiones)",
        "No cuantificar magnitud de diferencias regionales"
      ]
    }
  },
  {
    id: 5,
    title: "El Gráfico Perdido",
    text: "21 de noviembre, 2025, 3:00 AM. Analista de datos de campaña tiene que presentar en 4 horas. Tiene la data perfecta: intención de voto en segunda vuelta por NSE. Quiere hacer un gráfico de barras APILADAS que muestre la distribución % de Jara, Kast e Indecisos por cada NSE. Ha intentado 15 veces con ggplot pero siempre sale error o gráfico raro. Está desesperado. Necesita el código correcto de geom_bar() con position y los aesthetics exactos.",
    category: "Técnica - Visualización ggplot",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo crear un gráfico de barras apiladas (stacked bar chart) en ggplot mostrando distribución porcentual de categorías por grupos?",
      variables_esperadas: [
        "nse (variable categórica: ABC1, C2, C3, D, E)",
        "voto (variable categórica: Jara, Kast, Indeciso)"
      ],
      cruces_esperados: [
        "No aplica - es un problema técnico de visualización"
      ],
      graficos_apropiados: [
        "Stacked bar chart con position='fill' para mostrar proporciones",
        "Alternativa: Faceted bar chart si quiere comparar valores absolutos también"
      ],
      insights_clave: [
        "Debe usar geom_bar(stat='identity', position='fill') o geom_col(position='fill')",
        "Necesita mapear fill=voto en aes() para las categorías",
        "Debe multiplicar por 100 si quiere % en eje Y con scale_y_continuous(labels=scales::percent)",
        "Reordenar niveles de NSE con factor() antes de graficar"
      ],
      errores_comunes_a_penalizar: [
        "Usar position='dodge' en lugar de position='fill' (produce barras lado a lado)",
        "No especificar stat='identity' cuando tiene datos pre-agregados",
        "Mapear color= en vez de fill= (color afecta bordes, no relleno)",
        "No usar scale_fill_manual() para colores de candidatos personalizados",
        "Olvidar reorder() o factor() para ordenar NSE correctamente"
      ]
    }
  },
  {
    id: 6,
    title: "La Pesadilla del Facet",
    text: "22 de noviembre, 2025. Analista del comando de Jara debe mostrar la evolución de intención de voto en las 16 regiones en un solo gráfico para la reunión de estrategia territorial. Tiene data de 3 encuestas (Ago, Sep, Oct) por región. Intenta usar facet_wrap(~region) pero el gráfico sale ilegible: títulos cortados, escalas raras, 16 gráficos microscópicos. Necesita el código correcto con scales, ncol, y theme para que se vea profesional.",
    category: "Técnica - Visualización ggplot",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo crear múltiples gráficos pequeños (small multiples) por grupo usando facet_wrap() en ggplot de manera legible y profesional?",
      variables_esperadas: [
        "region (16 categorías)",
        "mes (Agosto, Septiembre, Octubre)",
        "intencion_voto_jara (numérico: porcentaje)"
      ],
      cruces_esperados: [
        "No aplica - es un problema técnico de visualización"
      ],
      graficos_apropiados: [
        "Line chart con facet_wrap(~region, ncol=4) para comparar tendencias",
        "Alternativa: geom_point() + geom_line() si hay pocos puntos temporales"
      ],
      insights_clave: [
        "Usar facet_wrap(~region, ncol=4, scales='free_y') para 4 columnas x 4 filas",
        "scales='free_y' permite que cada región tenga su propia escala Y",
        "Necesita theme(strip.text = element_text(size=8)) para títulos legibles",
        "Usar theme(axis.text.x = element_text(angle=45)) si labels X se superponen",
        "Considerar facet_wrap(~region, ncol=4, labeller=label_wrap_gen(width=15)) para nombres largos"
      ],
      errores_comunes_a_penalizar: [
        "No especificar ncol= (ggplot decide automático y queda mal)",
        "Usar scales='fixed' con regiones muy diferentes (obliga misma escala)",
        "No ajustar theme() para texto pequeño legible",
        "Poner demasiadas columnas (ncol=8) que hace gráficos microscópicos",
        "No acortar nombres de regiones largas antes de graficar"
      ]
    }
  },
  {
    id: 7,
    title: "La Sorpresa de Valparaíso",
    text: "23 de noviembre, 2025. La prensa está en shock: la Región de Valparaíso, histórico bastión de centro-izquierda desde el retorno a la democracia, apenas dio victoria a Jeanette Jara por solo 4 puntos en primera vuelta, cuando se esperaba un margen de 15-20 puntos. Un medio nacional te encarga análisis urgente: ¿qué pasó? ¿Por qué fue tan estrecho? ¿Fue por seguridad? ¿Economía? ¿Migración? ¿Qué comunas cambiaron más? El artículo se publica mañana y necesitas datos duros, no especulación.",
    category: "Análisis Post-Electoral",
    respuesta_ideal: {
      pregunta_investigacion: "¿Qué factores explican el estrechamiento electoral en la Región de Valparaíso y cómo varía el crecimiento de Kast por comuna y perfil sociodemográfico?",
      variables_esperadas: [
        "p20_voto_primera_vuelta",
        "p1_problema_mas_importante",
        "p50_percepcion_inseguridad",
        "p70_situacion_economica_hogar",
        "p94_opinion_migracion",
        "p47_confianza_carabineros",
        "comuna",
        "nse"
      ],
      cruces_esperados: [
        "Voto Kast x Problema más importante (Valparaíso vs Nacional)",
        "Voto Kast x Percepción inseguridad (Valparaíso)",
        "Voto Kast x Situación económica hogar (Valparaíso)",
        "Cambio electoral por comuna (2021 vs 2025)",
        "Voto Kast x Opinión migración x NSE (Valparaíso)"
      ],
      graficos_apropiados: [
        "Mapa comunal Valparaíso (% voto Kast, color intensity)",
        "Scatter plot (% voto Kast vs % preocupación seguridad por comuna)",
        "Gráfico de barras comparativo (problemas prioritarios votantes Kast vs Jara en Valparaíso)"
      ],
      insights_clave: [
        "Comunas costeras (Valparaíso, Viña) redujeron margen pro-Jara en 18pts vs 2021",
        "72% de votantes Kast en región priorizan seguridad/migración vs 28% en votantes Jara",
        "Hogares con economía 'mala/muy mala' votaron Kast 58% en Valparaíso vs 45% nacional",
        "Baja confianza Carabineros (under 30%) correlaciona fuertemente con crecimiento de Kast en la región"
      ],
      errores_comunes_a_penalizar: [
        "No comparar Valparaíso con tendencia nacional (¿es excepcional o general?)",
        "Ignorar variación comunal dentro de la región",
        "No usar datos de elecciones anteriores como baseline",
        "Proponer monocausalidad (solo seguridad O solo economía)",
        "No cuantificar magnitud del cambio electoral"
      ]
    }
  },
  {
    id: 8,
    title: "El Voto Joven Desaparecido",
    text: "24 de noviembre, 2025. Los números son brutales: solo 38% de jóvenes 18-29 años votó en primera vuelta, versus 68% de mayores de 50. Un think tank preocupado por la democracia te encarga investigar: ¿por qué no votan los jóvenes? ¿A quién favorece esta abstención? ¿Los que votaron se comportaron distinto que los mayores? ¿Qué podría movilizarlos en segunda vuelta? Presentas la próxima semana en el Congreso.",
    category: "Análisis Post-Electoral",
    respuesta_ideal: {
      pregunta_investigacion: "¿Cómo difiere el comportamiento electoral de jóvenes 18-29 versus mayores en participación, preferencias de voto y factores de movilización?",
      variables_esperadas: [
        "p23_participo_primera_vuelta",
        "p24_razon_no_voto",
        "p20_voto_primera_vuelta",
        "p5_interes_politica",
        "p10_identificacion_politica",
        "p1_problema_mas_importante",
        "p25_que_motivaria_votar",
        "edad",
        "nivel_educacional",
        "nse"
      ],
      cruces_esperados: [
        "Participación x Edad (18-29 vs 30-49 vs 50+)",
        "Razón no voto x Edad",
        "Voto (entre votantes) x Edad",
        "Interés política x Edad x Participación",
        "Identificación política x Edad",
        "Factores de movilización x Edad (entre abstencionistas)"
      ],
      graficos_apropiados: [
        "Gráfico de barras (participación por grupo etario)",
        "Pirámide comparativa (perfil votantes vs abstencionistas por edad)",
        "Stacked bar (distribución voto por grupo etario, solo entre votantes)",
        "Sankey diagram (flujo participación 1ra → intención 2da vuelta por edad)"
      ],
      insights_clave: [
        "Brecha participación 18-29 vs 50+ es de 30 puntos (la mayor registrada)",
        "Jóvenes que votaron prefirieron Jara 62% vs 38% Kast",
        "Principal razón no voto joven: 'ningún candidato me representa' (52%)",
        "Jóvenes abstencionistas muestran menor identificación política (72% 'ninguna') vs mayores (35%)",
        "Factor #1 que movilizaría jóvenes: candidatos con propuestas claras para su generación (48%)"
      ],
      errores_comunes_a_penalizar: [
        "No separar análisis de participación vs preferencia de voto (son distintos)",
        "Asumir que jóvenes son homogéneos (ignorar diferencias por NSE o educación)",
        "No distinguir entre desinterés político vs desencanto con opciones",
        "Ignorar contrafactual: ¿qué pasaría si jóvenes votaran al mismo % que mayores?",
        "No proponer recomendaciones específicas basadas en factores de movilización"
      ]
    }
  }
];
