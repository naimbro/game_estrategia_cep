const fs = require('fs');
const path = require('path');

console.log('🔄 Enriqueciendo variables.json con etiquetas del diccionario...\n');

// Cargar archivos
const variablesPath = path.join(__dirname, '..', 'src', 'data', 'variables.json');
const diccionarioPath = path.join(__dirname, '..', 'diccionario_limpio.json');

const variables = JSON.parse(fs.readFileSync(variablesPath, 'utf-8'));
const diccionario = JSON.parse(fs.readFileSync(diccionarioPath, 'utf-8'));

// Mapeo de códigos de variables del juego a nombres del diccionario CSV
// Algunos códigos en el juego tienen formato "p1_nombre" pero en el CSV pueden ser diferentes
const codeMapping = {
  // Demográficas básicas
  'sexo': 'sexo',
  'edad': 'edad',
  'nse': 'gse', // NSE en el juego = GSE en el CSV
  'region': 'region',
  'zona': 'zona',
};

// Intentar mapear variables automáticamente
let enrichedCount = 0;
let notFoundCount = 0;
const notFoundVars = [];

for (const [varKey, varData] of Object.entries(variables)) {
  // Intentar encontrar en diccionario usando diferentes estrategias
  let dictVar = null;

  // 1. Usar mapeo manual si existe
  if (codeMapping[varKey]) {
    dictVar = diccionario[codeMapping[varKey]];
  }

  // 2. Buscar por código exacto (ej: "p1_satisfaccion" -> buscar "p1")
  if (!dictVar && varData.code) {
    const codeNumber = varData.code.toLowerCase();
    // Buscar variaciones: p1, P1, satisfaccion_1, etc.
    dictVar = diccionario[codeNumber] ||
              diccionario[codeNumber.toUpperCase()] ||
              diccionario[varKey.toLowerCase()] ||
              diccionario[varKey];
  }

  // 3. Buscar por nombre de variable
  if (!dictVar) {
    dictVar = diccionario[varKey.toLowerCase()] || diccionario[varKey];
  }

  // Si encontramos la variable en el diccionario, agregar etiquetas
  if (dictVar && Object.keys(dictVar.etiquetas).length > 0) {
    varData.etiquetas_respuesta = dictVar.etiquetas;
    varData.pregunta_diccionario = dictVar.pregunta;
    enrichedCount++;

    // Log de ejemplo
    if (enrichedCount <= 5) {
      console.log(`✅ ${varKey}:`);
      console.log(`   Pregunta: ${dictVar.pregunta.substring(0, 60)}...`);
      console.log(`   Etiquetas: ${Object.values(dictVar.etiquetas).slice(0, 3).join(', ')}...`);
      console.log('');
    }
  } else {
    notFoundCount++;
    notFoundVars.push(varKey);
  }
}

console.log(`\n📊 Resultados:`);
console.log(`Total variables en juego: ${Object.keys(variables).length}`);
console.log(`Variables enriquecidas: ${enrichedCount}`);
console.log(`Variables no encontradas: ${notFoundCount}`);

if (notFoundVars.length > 0 && notFoundVars.length <= 20) {
  console.log(`\n⚠️ Variables no encontradas en diccionario:`);
  notFoundVars.forEach(v => console.log(`   - ${v}`));
}

// Guardar variables enriquecidas
const outputPath = path.join(__dirname, '..', 'src', 'data', 'variables_enriquecidas.json');
fs.writeFileSync(outputPath, JSON.stringify(variables, null, 2));
console.log(`\n✅ Variables enriquecidas guardadas en: ${outputPath}`);

// Crear también versión para usar en Cloud Functions (más ligera)
const variablesMetadata = {};
for (const [varKey, varData] of Object.entries(variables)) {
  if (varData.etiquetas_respuesta) {
    variablesMetadata[varKey] = {
      code: varData.code,
      name: varData.name,
      pregunta: varData.pregunta_diccionario || varData.encuestas?.[0]?.pregunta_exacta || '',
      etiquetas: varData.etiquetas_respuesta,
      tipo: varData.encuestas?.[0]?.tipo || 'categórica'
    };
  }
}

const metadataPath = path.join(__dirname, '..', 'src', 'data', 'variables_metadata.json');
fs.writeFileSync(metadataPath, JSON.stringify(variablesMetadata, null, 2));
console.log(`✅ Metadata para Cloud Functions guardada en: ${metadataPath}`);

console.log('\n🎉 Enriquecimiento completado!');
