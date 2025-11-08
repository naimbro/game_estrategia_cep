# Template para Variables CEP

Este archivo es un template para que llenes con las variables reales del CEP.

## Estructura de datos requerida

Cada variable debe tener:

```json
{
  "CODIGO_VARIABLE": {
    "code": "P47",  // Código de la pregunta en la encuesta
    "name": "Nombre corto descriptivo",
    "category": "Categoría general",
    "encuestas": [
      {
        "numero": 89,
        "periodo": "Jul 2024",
        "pregunta_exacta": "Texto exacto de la pregunta en la encuesta",
        "opciones": ["Opción 1", "Opción 2", "Opción 3"],
        "tipo": "ordinal" // ordinal, categórica, numérica
      }
    ],
    "tags": ["tag1", "tag2", "tag3"],
    "variables_relacionadas": ["codigo1", "codigo2"],
    "years": [2023, 2024]  // Rango de años disponibles
  }
}
```

## Ejemplo completo

```json
{
  "p47_confianza_carabineros": {
    "code": "P47",
    "name": "Confianza en Carabineros",
    "category": "Seguridad y Justicia",
    "encuestas": [
      {
        "numero": 89,
        "periodo": "Jul 2024",
        "pregunta_exacta": "¿Cuánta confianza tiene Ud. en Carabineros de Chile?",
        "opciones": ["Mucha", "Bastante", "Poca", "Ninguna", "NS/NR"],
        "tipo": "ordinal"
      },
      {
        "numero": 88,
        "periodo": "Abr 2024",
        "pregunta_exacta": "¿Cuánta confianza tiene Ud. en Carabineros de Chile?",
        "opciones": ["Mucha", "Bastante", "Poca", "Ninguna", "NS/NR"],
        "tipo": "ordinal"
      }
    ],
    "tags": ["confianza", "seguridad", "instituciones", "policía"],
    "variables_relacionadas": ["p48_confianza_pdi", "p52_victimizacion"],
    "years": [2023, 2024]
  },

  "p52_victimizacion": {
    "code": "P52",
    "name": "Victimización últimos 12 meses",
    "category": "Seguridad y Justicia",
    "encuestas": [
      {
        "numero": 89,
        "periodo": "Jul 2024",
        "pregunta_exacta": "¿Ha sido víctima de algún delito en los últimos 12 meses?",
        "opciones": ["Sí", "No", "Prefiere no responder"],
        "tipo": "categórica"
      }
    ],
    "tags": ["delincuencia", "victimización", "seguridad"],
    "variables_relacionadas": ["p47_confianza_carabineros", "p53_percepcion_seguridad"],
    "years": [2024, 2024]
  },

  "nse": {
    "code": "NSE",
    "name": "Nivel Socioeconómico",
    "category": "Sociodemográfica",
    "encuestas": [
      {
        "numero": 89,
        "periodo": "Jul 2024",
        "pregunta_exacta": "Clasificación socioeconómica del hogar",
        "opciones": ["ABC1", "C2", "C3", "D", "E"],
        "tipo": "ordinal"
      }
    ],
    "tags": ["demografía", "socioeconómico", "segmentación"],
    "variables_relacionadas": [],
    "years": [2020, 2024]
  }
}
```

## Categorías sugeridas

- Seguridad y Justicia
- Salud y Sistema de Salud
- Educación
- Economía y Empleo
- Política e Instituciones
- Medio Ambiente
- Sociodemográficas

## Instrucciones para llenar

1. Busca las encuestas CEP disponibles
2. Para cada variable relevante:
   - Anota el código (P##)
   - Nombre descriptivo corto
   - Categoría
   - En qué encuestas aparece (con número y periodo)
   - Texto exacto de la pregunta
   - Opciones de respuesta
   - Tipo de variable
3. Agrupa por categorías con tags
4. Identifica variables relacionadas

Una vez tengas la información, reemplaza el contenido de `src/data/variables.json` con tu estructura completa.
