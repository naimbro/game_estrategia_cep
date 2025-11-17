const fs = require('fs');
const path = require('path');

console.log('🔧 Creando metadata de variables para jueces IA...\n');

// Cargar variables del juego
const variablesPath = path.join(__dirname, '..', 'src', 'data', 'variables.json');
const diccionarioPath = path.join(__dirname, '..', 'diccionario_limpio.json');

const variables = JSON.parse(fs.readFileSync(variablesPath, 'utf-8'));
const diccionario = JSON.parse(fs.readFileSync(diccionarioPath, 'utf-8'));

// Etiquetas reales del diccionario para variables demográficas
const realLabels = {
  'sexo': diccionario['sexo'],
  'edad': diccionario['edad'],
  'nse': diccionario['gse'], // nse en juego = gse en diccionario
  'gse': diccionario['gse']
};

// Generar metadata enriquecida
const variablesMetadata = {};

for (const [varKey, varData] of Object.entries(variables)) {
  // Usar etiquetas reales si existen
  if (realLabels[varKey]) {
    const realVar = realLabels[varKey];
    variablesMetadata[varKey] = {
      code: varData.code,
      name: varData.name,
      pregunta: realVar.pregunta,
      etiquetas: realVar.etiquetas,
      tipo: varKey === 'edad' ? 'numérica' : 'categórica'
    };
    console.log(`✅ ${varKey}: etiquetas reales del diccionario`);
    continue;
  }

  // Para variables del juego, generar etiquetas basadas en su encuesta
  const primeraEncuesta = varData.encuestas?.[0];
  if (primeraEncuesta) {
    variablesMetadata[varKey] = {
      code: varData.code,
      name: varData.name,
      pregunta: primeraEncuesta.pregunta_exacta,
      tipo: primeraEncuesta.tipo,
      opciones: primeraEncuesta.opciones
    };
  } else {
    // Fallback genérico
    variablesMetadata[varKey] = {
      code: varData.code,
      name: varData.name,
      pregunta: varData.name,
      tipo: 'categórica'
    };
  }
}

// Estadísticas
const conEtiquetasReales = Object.values(variablesMetadata).filter(v => v.etiquetas).length;
const conOpciones = Object.values(variablesMetadata).filter(v => v.opciones).length;

console.log(`\n📊 Estadísticas:`);
console.log(`Total variables: ${Object.keys(variablesMetadata).length}`);
console.log(`Con etiquetas reales del diccionario: ${conEtiquetasReales}`);
console.log(`Con opciones de encuesta: ${conOpciones}`);

// Mostrar ejemplos
console.log(`\n🔍 Ejemplos de metadata generada:`);
const examples = ['sexo', 'nse', 'p1_satisfaccion_general', 'p10_aprobacion_gobierno'];
examples.forEach(key => {
  if (variablesMetadata[key]) {
    const v = variablesMetadata[key];
    console.log(`\n${key} (${v.code}):`);
    console.log(`  Pregunta: ${v.pregunta?.substring(0, 60)}...`);
    if (v.etiquetas) {
      console.log(`  Etiquetas: ${Object.values(v.etiquetas).join(' | ')}`);
    } else if (v.opciones) {
      console.log(`  Opciones: ${v.opciones.slice(0, 3).join(' | ')}...`);
    }
    console.log(`  Tipo: ${v.tipo}`);
  }
});

// Guardar metadata
const outputPath = path.join(__dirname, '..', 'src', 'data', 'variables_metadata.json');
fs.writeFileSync(outputPath, JSON.stringify(variablesMetadata, null, 2));
console.log(`\n✅ Metadata guardada en: ${outputPath}`);
console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

console.log('\n🎉 Metadata creada exitosamente!');
