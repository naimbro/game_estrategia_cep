const fs = require('fs');
const path = require('path');

// Función para parsear CSV manualmente (maneja comillas y comas)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

// Leer y procesar el CSV
console.log('📖 Leyendo diccionario CSV...');
const csvPath = path.join(__dirname, '..', 'diccionario_base_consolidada_hasta_95.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');

console.log(`Total de líneas: ${lines.length}`);

// Estructura para almacenar variables
const variablesDict = {};
let processedCount = 0;
let skippedCount = 0;
let emptyLabels = 0;

// Procesar cada línea (saltar header)
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const [variable, pregunta, alternativa, etiqueta] = parseCSVLine(line);

  // Saltar si no hay variable
  if (!variable || variable === 'variable') {
    skippedCount++;
    continue;
  }

  // Inicializar variable si no existe
  if (!variablesDict[variable]) {
    variablesDict[variable] = {
      variable: variable,
      pregunta: pregunta || '',
      etiquetas: {}
    };
  }

  // Agregar etiqueta si existe
  if (alternativa && etiqueta) {
    // Solo agregar si no existe ya (evitar duplicados exactos)
    if (!variablesDict[variable].etiquetas[alternativa]) {
      variablesDict[variable].etiquetas[alternativa] = etiqueta;
      processedCount++;
    }
  } else {
    emptyLabels++;
  }
}

// Convertir a array y ordenar
const variablesArray = Object.values(variablesDict);

// Estadísticas
console.log('\n📊 Estadísticas:');
console.log(`Variables únicas: ${variablesArray.length}`);
console.log(`Etiquetas procesadas: ${processedCount}`);
console.log(`Líneas sin etiqueta: ${emptyLabels}`);
console.log(`Líneas saltadas: ${skippedCount}`);

// Análisis de duplicados
const variablesWithLabels = variablesArray.filter(v => Object.keys(v.etiquetas).length > 0);
const variablesWithoutLabels = variablesArray.filter(v => Object.keys(v.etiquetas).length === 0);

console.log(`\nVariables con etiquetas: ${variablesWithLabels.length}`);
console.log(`Variables sin etiquetas: ${variablesWithoutLabels.length}`);

// Top 10 variables con más etiquetas
const sortedByLabels = [...variablesWithLabels].sort((a, b) =>
  Object.keys(b.etiquetas).length - Object.keys(a.etiquetas).length
);

console.log('\n🏆 Top 10 variables con más etiquetas:');
sortedByLabels.slice(0, 10).forEach((v, i) => {
  console.log(`${i + 1}. ${v.variable}: ${Object.keys(v.etiquetas).length} etiquetas`);
});

// Ejemplos de variables comunes
console.log('\n🔍 Ejemplos de variables comunes:');
const commonVars = ['sexo', 'edad', 'region', 'zona'];
commonVars.forEach(varName => {
  const v = variablesDict[varName];
  if (v) {
    console.log(`\n${varName}:`);
    console.log(`  Pregunta: ${v.pregunta}`);
    console.log(`  Etiquetas: ${JSON.stringify(v.etiquetas, null, 2)}`);
  }
});

// Guardar diccionario limpio
const outputPath = path.join(__dirname, '..', 'diccionario_limpio.json');
fs.writeFileSync(outputPath, JSON.stringify(variablesDict, null, 2));
console.log(`\n✅ Diccionario limpio guardado en: ${outputPath}`);

// Guardar también un resumen más compacto
const summaryPath = path.join(__dirname, '..', 'diccionario_resumen.json');
const summary = variablesArray.map(v => ({
  variable: v.variable,
  pregunta: v.pregunta,
  num_etiquetas: Object.keys(v.etiquetas).length,
  etiquetas_texto: Object.values(v.etiquetas).slice(0, 5).join(' | ') +
    (Object.keys(v.etiquetas).length > 5 ? '...' : '')
}));
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
console.log(`✅ Resumen guardado en: ${summaryPath}`);

console.log('\n🎉 Procesamiento completado!');
