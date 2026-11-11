import React from 'react';
import { CholeskyResult, FinancialVariable } from '../types/financial';
import { CheckCircle2, AlertOctagon, HelpCircle, Layers } from 'lucide-react';

interface ReferenceSolutionSectionProps {
  cholesky: CholeskyResult;
  variables: FinancialVariable[];
  b: number[];
}

export const ReferenceSolutionSection: React.FC<ReferenceSolutionSectionProps> = ({
  cholesky,
  variables,
  b,
}) => {
  const n = cholesky.L?.length || 0;

  return (
    <section id="solucion-referencia" className="py-12 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">SECCIÓN 6 · MÉTODO DIRECTO</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Solución Numérica de Referencia (Factorización de Cholesky A = LLᵀ)
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Conforme al requerimiento de la Sección 6.2, se calcula la solución numérica de referencia mediante el método
            directo exacto de Cholesky, resolviendo en dos fases: sustitución progresiva{' '}
            <span className="font-mono font-medium">Ly = b</span> y regresiva{' '}
            <span className="font-mono font-medium">Lᵀx = y</span>.
          </p>
        </div>

        {/* Terminological clarification box */}
        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 mb-8 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-indigo-950">Aclaración Terminológica Oficial: </span>
            Se denominará <em>“Solución numérica de referencia”</em> al vector obtenido mediante el método directo; esta
            podrá clasificarse formalmente como <em>“Solución exacta”</em> (xref). Los errores numéricos de Gradientes
            Conjugados Precondicionado (GCP) se medirán rigurosamente respecto a este vector.
          </div>
        </div>

        {!cholesky.success ? (
          <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-900">No se pudo calcular la solución de referencia</h3>
              <p className="text-xs text-red-700 mt-1">{cholesky.errorMessage}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Vector Solución de Referencia Cards */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Vector Solución Numérica de Referencia (x_ref)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cholesky.x.map((val, i) => {
                  const v = variables[i] || {
                    id: `x${i + 1}`,
                    symbol: `x_${i + 1}`,
                    name: `Variable ${i + 1}`,
                    unit: 'unidades',
                  };
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {v.symbol || `x_${i + 1}`}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">{v.unit}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">{v.name}</h4>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <div className="text-[11px] text-slate-500 mb-0.5">Asignación Exacta:</div>
                        <div className="text-xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                          {val.toFixed(6)}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Punto de equilibrio óptimo</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decomposition Details: L and y */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lower Triangular Matrix L */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Matriz Triangular Inferior L de Cholesky (A = L Lᵀ)
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">{n}×{n}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-center font-mono text-xs border-collapse">
                    <tbody>
                      {cholesky.L.map((row, i) => (
                        <tr key={i} className="border-b border-slate-200/60 last:border-0">
                          {row.map((val, j) => (
                            <td
                              key={j}
                              className={`py-2 px-2.5 tabular-nums ${
                                i === j
                                  ? 'font-bold text-indigo-900 bg-indigo-100/60'
                                  : i > j
                                  ? 'text-slate-800 font-medium bg-white'
                                  : 'text-slate-300'
                              }`}
                            >
                              {val.toFixed(4)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-[11px] text-slate-500">
                  Diagonal estrictamente positiva: l_ii &gt; 0, garantizada por ser A definida positiva.
                </div>
              </div>

              {/* Intermediate substitution y and Back solve explanation */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Fases de Sustitución Progresiva y Regresiva
                  </h3>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="flex justify-between items-center mb-1 font-bold text-slate-900">
                        <span>Paso 1: Sustitución Progresiva Ly = b</span>
                        <span className="text-indigo-600 font-mono">Vector Auxiliar y</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 font-mono text-xs mt-2">
                        {cholesky.y.map((yVal, i) => (
                          <div key={i} className="p-1.5 bg-slate-50 border border-slate-200 rounded text-center">
                            <span className="text-slate-500 text-[10px] block">y_{i + 1}</span>
                            <span className="font-bold text-slate-800 tabular-nums">{yVal.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="flex justify-between items-center mb-1 font-bold text-slate-900">
                        <span>Paso 2: Sustitución Regresiva Lᵀx = y</span>
                        <span className="text-emerald-600 font-mono">Solución xref</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">
                        Resolviendo hacia atrás con la transpuesta triangular superior Lᵀ, se obtiene el vector final{' '}
                        <span className="font-mono font-semibold text-slate-800">x_ref</span> con costo computacional O(n²/2),
                        óptimo para matrices simétricas y definidas positivas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  Costo algorítmico total de Cholesky: ~n³/3 operaciones de punto flotante (la mitad que la eliminación de Gauss).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
