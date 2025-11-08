import { useState, useMemo } from 'react';
import { Search, X, Plus } from 'lucide-react';
import cepVariables from '../data/variables.json';

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

  // Obtener todas las tags únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(cepVariables).forEach(variable => {
      variable.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filtrar variables
  const filteredVariables = useMemo(() => {
    return Object.entries(cepVariables).filter(([code, data]) => {
      // Filtro por término de búsqueda
      const matchesSearch = searchTerm === '' ||
        code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro por tag seleccionado
      const matchesTag = selectedTag === null || data.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  return (
    <div className={`dramatic-card p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-3 text-purple-300">
        Explorador de Variables CEP
      </h3>

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
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            selectedTag === null
              ? 'bg-purple-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          Todas
        </button>
        {allTags.slice(0, 8).map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              selectedTag === tag
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {tag}
          </button>
        ))}
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
                    <h4 className="font-semibold text-sm text-purple-200">
                      {data.name}
                    </h4>
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
