import React, { useState } from 'react';
import { FinancialVariable, PreconditionerType, ScenarioDefinition } from '../types/financial';
import {
  Sliders,
  RotateCcw,
  Link2,
  Unlink2,
  Zap,
  PlusCircle,
  Plus,
  Minus,
  Save,
  Check,
  FolderPlus,
  X,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface DataInputSectionProps {
  scenarios: Record<string, ScenarioDefinition>;
  currentScenarioId: string;
  onSelectScenario: (id: string) => void;
  onAddNewScenario: (newScenario: ScenarioDefinition) => void;
  onAddVariable: () => void;
  onRemoveVariable: () => void;
  A: number[][];
  b: number[];
  x0: number[];
  variables: FinancialVariable[];
  tolerance: number;
  preconditioner: PreconditionerType;
  onChangeA: (newA: number[][]) => void;
  onChangeB: (newB: number[]) => void;
  onChangeX0: (newX0: number[]) => void;
  onChangeTolerance: (newTol: number) => void;
  onChangePreconditioner: (p: PreconditionerType) => void;
  onResetScenario: () => void;
}

export const DataInputSection: React.FC<DataInputSectionProps> = ({
  scenarios,
  currentScenarioId,
  onSelectScenario,
  onAddNewScenario,
  onAddVariable,
  onRemoveVariable,
  A,
  b,
  x0,
  variables,
  tolerance,
  preconditioner,
  onChangeA,
  onChangeB,
  onChangeX0,
  onChangeTolerance,
  onChangePreconditioner,
  onResetScenario,
}) => {
  const [autoSymmetry, setAutoSymmetry] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'todos' | 'obligatorio' | 'mencion' | 'personalizado'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSaveCurrentModal, setShowSaveCurrentModal] = useState(false);

  // New Case Modal Form State
  const [newCaseName, setNewCaseName] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newCaseDim, setNewCaseDim] = useState<number>(4);
  const [newCaseBadge, setNewCaseBadge] = useState('Caso Personalizado');

  // Save current form state
  const [saveCurrentName, setSaveCurrentName] = useState('');

  const n = A.length;

  const handleCellChange = (i: number, j: number, rawVal: string) => {
    const val = parseFloat(rawVal) || 0;
    const newA = A.map(row => [...row]);
    newA[i][j] = val;
    if (autoSymmetry && i !== j) {
      newA[j][i] = val;
    }
    onChangeA(newA);
  };

  const handleBChange = (i: number, rawVal: string) => {
    const val = parseFloat(rawVal) || 0;
    const newB = [...b];
    newB[i] = val;
    onChangeB(newB);
  };

  const handleX0Change = (i: number, rawVal: string) => {
    const val = parseFloat(rawVal) || 0;
    const newX0 = [...x0];
    newX0[i] = val;
    onChangeX0(newX0);
  };

  const setZeroX0 = () => {
    onChangeX0(new Array(n).fill(0));
  };

  // Submit handler for adding a new financial case
  const handleCreateNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseName.trim()) return;

    const dim = Math.max(4, newCaseDim);
    const newVariables: FinancialVariable[] = Array.from({ length: dim }).map((_, idx) => ({
      id: `var_${idx + 1}`,
      symbol: `x_${idx + 1}`,
      name: `Activo / Partida ${idx + 1}`,
      unit: 'M$ (Millones USD)',
      description: `Variable financiera ${idx + 1} del modelo personalizado.`,
    }));

    // Create a well-conditioned symmetric positive definite matrix of size dim
    const newA: number[][] = Array.from({ length: dim }, () => new Array(dim).fill(0));
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        if (i === j) {
          newA[i][j] = 12.0 + i * 2.0; // Strong positive diagonal
        } else {
          newA[i][j] = 1.0 + Math.min(i, j) * 0.5; // Symmetric moderate covariances
        }
      }
    }

    const newB = Array.from({ length: dim }).map((_, idx) => 20.0 + idx * 5.0);

    const newCaseId = `custom_${Date.now()}`;
    const newScenario: ScenarioDefinition = {
      id: newCaseId,
      name: newCaseName.trim(),
      badge: newCaseBadge || 'Caso Personalizado',
      description: newCaseDesc.trim() || 'Caso financiero personalizado modelado por el usuario.',
      financialContext: 'Modelo financiero personalizado con simetría y definición positiva garantizada.',
      A: newA,
      b: newB,
      variables: newVariables,
      defaultPreconditioner: 'jacobi',
      expectedConditionRatio: `Dimensión n=${dim} · Simétrica Definida Positiva`,
      category: 'personalizado',
    };

    onAddNewScenario(newScenario);
    setShowAddModal(false);
    setNewCaseName('');
    setNewCaseDesc('');
  };

  // Handler to save current matrix as a custom scenario
  const handleSaveCurrentAsCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveCurrentName.trim()) return;

    const newCaseId = `custom_${Date.now()}`;
    const newScenario: ScenarioDefinition = {
      id: newCaseId,
      name: saveCurrentName.trim(),
      badge: `Personalizado (n=${n})`,
      description: `Copia personalizada creada a partir del editor dinámico con ${n} variables.`,
      financialContext: 'Escenario financiero guardado con parámetros personalizados de la sesión.',
      A: A.map(r => [...r]),
      b: [...b],
      variables: [...variables],
      defaultPreconditioner: preconditioner,
      expectedConditionRatio: `Dimensión n=${n} · Precondicionador ${preconditioner.toUpperCase()}`,
      category: 'personalizado',
    };

    onAddNewScenario(newScenario);
    setShowSaveCurrentModal(false);
    setSaveCurrentName('');
  };

  const filteredScenarios = Object.values(scenarios).filter(sc => {
    if (activeCategory === 'todos') return true;
    if (activeCategory === 'obligatorio') return sc.category === 'obligatorio' || ['ideal', 'estres', 'mal_condicionado'].includes(sc.id);
    if (activeCategory === 'mencion') return sc.category === 'mencion';
    if (activeCategory === 'personalizado') return sc.category === 'personalizado';
    return true;
  });

  return (
    <section id="simulador" className="py-12 border-b border-slate-200 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">
              SECCIONES 4 & 5 · ENTRADA DE DATOS Y GESTIÓN DE CASOS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Entrada de Datos, Casos Financieros y Editor Numérico Dinámico
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Cargue los escenarios obligatorios, los casos sugeridos según mención (Sección 4) o agregue nuevos casos financieros
              personalizados (n ≥ 4). Edite cualquier coeficiente con recálculo reactivo en tiempo real.
            </p>
          </div>

          {/* Action buttons: Add New Case & Save Current */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Agregar Nuevo Caso Financiero</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSaveCurrentModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Guardar Matriz Actual</span>
            </button>
          </div>
        </div>

        {/* Filter bar for Case categories */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveCategory('todos')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === 'todos' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos los Casos ({Object.keys(scenarios).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('obligatorio')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === 'obligatorio' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3 Escenarios Obligatorios
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('mencion')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === 'mencion' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Casos por Mención & Dimensiones (n=4, 5, 6)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('personalizado')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeCategory === 'personalizado' ? 'bg-indigo-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Casos Creados por el Usuario
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Dimensión Actual:</span>
            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {n} × {n} ({n} ecuaciones)
            </span>
          </div>
        </div>

        {/* Scenarios Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredScenarios.map((sc: ScenarioDefinition) => {
            const isSelected = currentScenarioId === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc.id)}
                className={`p-5 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-indigo-700 uppercase tracking-wider">
                      {sc.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded">
                        ACTIVO
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{sc.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">{sc.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono flex items-center justify-between">
                  <span>{sc.expectedConditionRatio}</span>
                  <span className="text-slate-400 font-sans">{sc.A.length}×{sc.A.length}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Global Controls & Preconditioner Selector Bar */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Preconditioner Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Precondicionador M
              </label>
              <select
                value={preconditioner}
                onChange={e => onChangePreconditioner(e.target.value as PreconditionerType)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="jacobi">Jacobi (Diagonal M = diag(A)) — Recomendado</option>
                <option value="ssor">SSOR (Symmetric Gauss-Seidel ω=1)</option>
                <option value="none">Sin Precondicionar (M = I, GC Simple)</option>
              </select>
              <div className="mt-1 text-[11px] text-slate-500">
                {preconditioner === 'jacobi' && 'Escala diagonalmente; ideal para variables de magnitudes dispares.'}
                {preconditioner === 'ssor' && 'Factorización simétrica relajada; mitiga correlaciones cruzadas.'}
                {preconditioner === 'none' && 'Equivale exactamente a Gradientes Conjugados clásico.'}
              </div>
            </div>

            {/* Tolerance */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tolerancia de Parada (ε)
              </label>
              <select
                value={tolerance}
                onChange={e => onChangeTolerance(parseFloat(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              >
                <option value={1e-4}>10⁻⁴ (0.0001)</option>
                <option value={1e-6}>10⁻⁶ (1e-6) — Requerimiento Oficial</option>
                <option value={1e-8}>10⁻⁸ (1e-8)</option>
                <option value={1e-10}>10⁻¹⁰ (1e-10)</option>
              </select>
              <div className="mt-1 text-[11px] text-slate-500">
                Criterio: ||r_k||₂ / ||b||₂ &lt; ε
              </div>
            </div>

            {/* Vector x0 Initial */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Vector Inicial x₀ ({n} elementos)
                </label>
                <button
                  type="button"
                  onClick={setZeroX0}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Fijar a 0
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {x0.map((val, idx) => (
                  <input
                    key={idx}
                    type="number"
                    step="any"
                    value={val}
                    onChange={e => handleX0Change(idx, e.target.value)}
                    className="w-full text-xs font-mono text-center bg-slate-50 border border-slate-300 rounded px-1.5 py-1.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    title={`x0[${idx + 1}]`}
                  />
                ))}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Por defecto: [0, ..., 0]ᵀ (Suñagua, 2020)
              </div>
            </div>

            {/* Reset & Symmetry Toggle */}
            <div className="flex flex-col justify-end gap-2">
              <button
                type="button"
                onClick={() => setAutoSymmetry(!autoSymmetry)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  autoSymmetry
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {autoSymmetry ? <Link2 className="w-3.5 h-3.5" /> : <Unlink2 className="w-3.5 h-3.5" />}
                <span>{autoSymmetry ? 'Simetría Automática: ON' : 'Simetría Libre: OFF'}</span>
              </button>

              <button
                type="button"
                onClick={onResetScenario}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Caso Actual</span>
              </button>
            </div>
          </div>
        </div>

        {/* Matrix A and Vector b Editable Grid with Dynamic Dimension Controls */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Editor de Coeficientes A ({n}×{n}) y Vector b
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Edite valores de la matriz o modifique dinámicamente la cantidad de variables y ecuaciones (n ≥ 4).
              </p>
            </div>

            {/* Matrix Dimension Modification Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onAddVariable}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                title="Aumentar dimensión (n + 1)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Variable (n={n + 1})</span>
              </button>

              <button
                type="button"
                onClick={onRemoveVariable}
                disabled={n <= 4}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  n <= 4
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title={n <= 4 ? 'El desafío exige como mínimo n ≥ 4 ecuaciones' : 'Reducir dimensión (n - 1)'}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Quitar Variable</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 px-3 text-left w-12">Fila</th>
                  {Array.from({ length: n }).map((_, j) => (
                    <th key={j} className="py-2 px-3 text-center">
                      a_{'{i,' + (j + 1) + '}'}
                    </th>
                  ))}
                  <th className="py-2 px-3 text-center bg-amber-50/60 text-amber-900 border-l border-slate-200 w-36">
                    Vector b (Demanda)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {A.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-xs text-slate-400">
                      i = {i + 1}
                    </td>
                    {row.map((val, j) => (
                      <td key={j} className="py-1.5 px-2 text-center">
                        <input
                          type="number"
                          step="any"
                          value={val}
                          onChange={e => handleCellChange(i, j, e.target.value)}
                          className={`w-full max-w-[120px] text-center font-mono text-xs py-1.5 px-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 tabular-nums ${
                            i === j
                              ? 'bg-indigo-50/80 font-bold text-indigo-950 border-indigo-200'
                              : 'bg-white font-medium text-slate-800 border-slate-200'
                          }`}
                          title={`a_${i + 1}${j + 1}`}
                        />
                      </td>
                    ))}
                    <td className="py-1.5 px-3 text-center bg-amber-50/40 border-l border-slate-200">
                      <input
                        type="number"
                        step="any"
                        value={b[i] ?? 0}
                        onChange={e => handleBChange(i, e.target.value)}
                        className="w-full max-w-[120px] text-center font-mono font-bold text-xs py-1.5 px-2 rounded bg-white text-amber-950 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 tabular-nums"
                        title={`b_${i + 1}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Agregar Nuevo Caso Financiero */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Agregar Nuevo Caso Financiero</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateNewCase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Caso Financiero *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCaseName}
                    onChange={e => setNewCaseName(e.target.value)}
                    placeholder="Ej. Cartera de Inversión Tecnológica 2026"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    value={newCaseBadge}
                    onChange={e => setNewCaseBadge(e.target.value)}
                    placeholder="Ej. Cartera Personalizada"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dimensión del Sistema (Ecuaciones e Incógnitas n ≥ 4) *
                  </label>
                  <select
                    value={newCaseDim}
                    onChange={e => setNewCaseDim(parseInt(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  >
                    <option value={4}>n = 4 ecuaciones (4 × 4) — Mínimo Requerido</option>
                    <option value={5}>n = 5 ecuaciones (5 × 5)</option>
                    <option value={6}>n = 6 ecuaciones (6 × 6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contexto y Justificación Financiera
                  </label>
                  <textarea
                    rows={3}
                    value={newCaseDesc}
                    onChange={e => setNewCaseDesc(e.target.value)}
                    placeholder="Describe el objetivo financiero, los activos involucrados y los flujos esperados..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-[11px] text-indigo-900">
                  <strong>Garantía Matemática:</strong> El caso se creará automáticamente con una matriz simétrica estrictamente definida positiva (con diagonal dominante y menores de Sylvester positivos), lista para resolver con Cholesky y Gradientes Conjugados Precondicionado.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Cargar Caso</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Guardar Matriz Actual Como Caso */}
        {showSaveCurrentModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900">Guardar Estado Actual Como Caso</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSaveCurrentModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCurrentAsCase} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Caso Guardado *
                  </label>
                  <input
                    type="text"
                    required
                    value={saveCurrentName}
                    onChange={e => setSaveCurrentName(e.target.value)}
                    placeholder="Ej. Mi Matriz Calibrada 2026"
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="text-xs text-slate-600">
                  Se guardarán los {n} coeficientes de la matriz A, el vector b de {n} elementos y el precondicionador actual ({preconditioner.toUpperCase()}).
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowSaveCurrentModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Caso</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
