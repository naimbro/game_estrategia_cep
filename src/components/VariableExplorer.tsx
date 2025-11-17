import { useState, useMemo } from 'react';
import { Search, X, Plus, HelpCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import cepVariables from '../data/variables.json';
import variablesMetadata from '../data/variables_metadata.json';

interface VariableExplorerProps {
  selectedVariables: string[];
  onVariableSelect: (variableCode: string) => void;
  onVariableRemove: (variableCode: string) => void;
  className?: string;
}

export default function VariableExplorer({
  selectedVariables,
  onVariableSelect,
  onVariableRemove,
  className = ''
}: VariableExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [expandedVariable, setExpandedVariable] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  // Obtener todas las tags únicas con contador
  const allTags = useMemo(() => {
    const tagCounts = new Map<string, number>();
    Object.values(cepVariables).forEach(variable => {
      variable.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Ordenar por frecuencia descendente
      .map(([tag, count]) => ({ tag, count }));
  }, []);

  const totalVariables = Object.keys(cepVariables).length;

  // Filtrar variables
  const filteredVariables = useMemo(() => {
    return Object.entries(cepVariables).filter(([code, data]) => {
      // Filtro por término de búsqueda
      const matchesSearch = searchTerm === '' ||
        code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro por tag seleccionado
      const matchesTag = !selectedTag || data.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  return (
    <div className={`dramatic-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-purple-300">
            Explorador de Variables CEP
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {totalVariables} variables disponibles
          </p>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-1 text-sm text-purple-300 hover:text-purple-200 transition-colors"
          title={showHelp ? "Ocultar ayuda" : "¿Cómo usar el explorador?"}
        >
          <HelpCircle className="w-4 h-4" />
          {showHelp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Sección de ayuda colapsable */}
      {showHelp && (
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-purple-500/30">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">
            📚 Cómo usar el Explorador de Variables
          </h4>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex gap-2">
              <span className="text-purple-400 font-bold">1.</span>
              <div>
                <strong className="text-purple-300">Buscar variables:</strong> Usa la barra de búsqueda para encontrar variables por nombre, código o tema (ej: "pensiones", "P82", "seguridad").
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-400 font-bold">2.</span>
              <div>
                <strong className="text-purple-300">Filtrar por tema:</strong> Haz clic en las etiquetas de temas (política, economía, etc.) para filtrar variables relacionadas. Haz clic de nuevo para quitar el filtro.
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-400 font-bold">3.</span>
              <div>
                <strong className="text-purple-300">Seleccionar variables:</strong> Haz clic en el botón <Plus className="w-3 h-3 inline" /> para agregar una variable a tu análisis. Las variables seleccionadas aparecerán arriba en píldoras moradas.
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-400 font-bold">4.</span>
              <div>
                <strong className="text-purple-300">Remover variables:</strong> Haz clic en la <X className="w-3 h-3 inline" /> en las píldoras moradas o en el botón rojo de la lista para quitar variables seleccionadas.
              </div>
            </div>
            <div className="mt-2 p-2 bg-purple-900/20 rounded border border-purple-500/20">
              <p className="text-purple-200">
                💡 <strong>Tip:</strong> Necesitas seleccionar variables relevantes para tu propuesta de análisis. Los jueces IA evaluarán si tus variables son apropiadas para responder la pregunta del escenario.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Búsqueda */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar variables..."
          className="input-field w-full pl-10"
        />
      </div>

      {/* Filtros por tags */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">
            Filtrar por tema ({allTags.length} temas):
          </p>
          {allTags.length > 8 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-xs text-purple-300 hover:text-purple-200 transition-colors"
            >
              {showAllTags ? 'Ver menos' : `Ver todos (${allTags.length})`}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              !selectedTag
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            Todas ({totalVariables})
          </button>
          {(showAllTags ? allTags : allTags.slice(0, 8)).map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1 ${
                selectedTag === tag
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {tag}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Variables seleccionadas */}
      {selectedVariables.length > 0 && (
        <div className="mb-3 p-2 bg-slate-800/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">
            Variables seleccionadas ({selectedVariables.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedVariables.map(code => {
              const variable = cepVariables[code as keyof typeof cepVariables];
              return (
                <div
                  key={code}
                  className="flex items-center gap-2 bg-purple-900/50 px-3 py-1 rounded-full text-sm"
                >
                  <span className="text-purple-200">{variable?.name || code}</span>
                  <button
                    onClick={() => onVariableRemove(code)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de variables disponibles */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredVariables.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No se encontraron variables
          </p>
        ) : (
          filteredVariables.slice(0, 20).map(([code, data]) => {
            const isSelected = selectedVariables.includes(code);
            const isExpanded = expandedVariable === code;
            const metadata = (variablesMetadata as any)[code];

            return (
              <div
                key={code}
                className={`p-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-900/30'
                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h4 className="font-semibold text-sm text-purple-200 flex-1">
                        {data.name}
                      </h4>
                      {metadata && (
                        <button
                          onClick={() => setExpandedVariable(isExpanded ? null : code)}
                          className="text-purple-300 hover:text-purple-200 transition-colors shrink-0"
                          title={isExpanded ? "Ocultar detalles" : "Ver detalles"}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Código: {code} | Años: {data.years[0]}-{data.years[1]}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {data.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-700 text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Panel expandible con detalles */}
                    {isExpanded && metadata && (
                      <div className="mt-3 p-2 bg-slate-900/50 rounded border border-purple-500/20">
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-semibold text-purple-300 mb-1">Pregunta:</p>
                            <p className="text-xs text-gray-300 italic">"{metadata.pregunta}"</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-purple-300 mb-1">
                              Tipo: <span className="text-gray-300 font-normal">{metadata.tipo}</span>
                            </p>
                          </div>
                          {metadata.opciones && (
                            <div>
                              <p className="text-xs font-semibold text-purple-300 mb-1">
                                Opciones de respuesta:
                              </p>
                              <ul className="text-xs text-gray-300 space-y-0.5 ml-3">
                                {metadata.opciones.map((opcion: string, idx: number) => (
                                  <li key={idx} className="list-disc">
                                    {opcion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {metadata.etiquetas && (
                            <div>
                              <p className="text-xs font-semibold text-purple-300 mb-1">
                                Etiquetas de respuesta:
                              </p>
                              <div className="text-xs text-gray-300 space-y-0.5">
                                {Object.entries(metadata.etiquetas).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="text-purple-400">{key}:</span> {value as string}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      isSelected ? onVariableRemove(code) : onVariableSelect(code)
                    }
                    className={`shrink-0 p-2 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-red-600 hover:bg-red-500'
                        : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    {isSelected ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredVariables.length > 20 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Mostrando 20 de {filteredVariables.length} variables. Refina tu búsqueda para ver más.
        </p>
      )}
    </div>
  );
}
