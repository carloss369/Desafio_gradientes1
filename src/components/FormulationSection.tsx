import React from 'react';
import { FinancialVariable, MatrixValidationResult } from '../types/financial';
import { CheckCircle2, AlertTriangle, Calculator, Binary } from 'lucide-react';

interface FormulationSectionProps {
  A: number[][];
  b: number[];
  variables: FinancialVariable[];
  validation: MatrixValidationResult;
}

export const FormulationSection: React.FC<FormulationSectionProps> = ({
  A,
  b,
  variables,
  validation,
}) => {
  const n = A.length;

  return (
    <section id="formulacion" className="py-12 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">SECCIÓN 3 · FORMULACIÓN MATEMÁTICA</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Variables Financieras y Sistema Lineal Ax = b
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Definición explícita de las {n} variables financieras del modelo, interpretación de coeficientes y demostración
            formal en tiempo real de simetría y definición positiva (Criterio de Sylvester y Autovalores).
          </p>
        </div>

        {/* Variables Cards Grid */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Definición de Magnitudes Financieras (n = {n} Variables)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {variables.map((v, idx) => (
              <div key={v.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {v.symbol || `x_${idx + 1}`}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">{v.unit}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{v.name}</h4>
                  <p className="text-xs text-slate-600 leading-normal">{v.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between">
                  <span>Demanda meta b_{idx + 1}:</span>
                  <span className="font-mono font-bold text-slate-800">{b[idx]?.toFixed(2)} {v.unit.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matrix Display and Interpretation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Matrix Representation */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-indigo-600" />
                Matriz de Coeficientes A ({n}×{n}) y Vector b
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Ax = b</span>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-flex items-center gap-2 p-2">
                {/* Matrix A with bracket styling */}
                <div className="relative px-2 py-1">
                  <div className="absolute inset-y-0 left-0 w-2 border-y-2 border-l-2 border-slate-700 rounded-l" />
                  <div className="absolute inset-y-0 right-0 w-2 border-y-2 border-r-2 border-slate-700 rounded-r" />
                  <div className="grid gap-2 text-center font-mono text-xs" style={{ gridTemplateColumns: `repeat(${n}, minmax(54px, 1fr))` }}>
                    {A.map((row, i) =>
                      row.map((val, j) => (
                        <div
                          key={`${i}-${j}`}
                          className={`px-1.5 py-1 rounded text-center tabular-nums ${
                            i === j
                              ? 'bg-indigo-100/70 font-bold text-indigo-950 border border-indigo-200'
                              : 'bg-white font-medium text-slate-700 border border-slate-200'
                          }`}
                          title={`a_${i+1}${j+1}: ${i === j ? 'Varianza propia regularizada' : 'Covarianza cruzada'}`}
                        >
                          {val >= 1000 ? val.toFixed(0) : val.toFixed(val < 10 ? 2 : 1)}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* x vector */}
                <div className="relative px-2 py-1 font-mono text-xs">
                  <div className="absolute inset-y-0 left-0 w-2 border-y-2 border-l-2 border-slate-700 rounded-l" />
                  <div className="absolute inset-y-0 right-0 w-2 border-y-2 border-r-2 border-slate-700 rounded-r" />
                  <div className="flex flex-col gap-2 py-0.5">
                    {variables.map((v, i) => (
                      <div key={i} className="px-1.5 py-1 font-bold text-indigo-700 text-center">
                        {v.symbol || `x_${i + 1}`}
                      </div>
                    ))}
                  </div>
                </div>

                <span className="font-bold text-slate-700 text-sm">=</span>

                {/* b vector */}
                <div className="relative px-2 py-1 font-mono text-xs">
                  <div className="absolute inset-y-0 left-0 w-2 border-y-2 border-l-2 border-slate-700 rounded-l" />
                  <div className="absolute inset-y-0 right-0 w-2 border-y-2 border-r-2 border-slate-700 rounded-r" />
                  <div className="flex flex-col gap-2 py-0.5">
                    {b.map((val, i) => (
                      <div key={i} className="px-2 py-1 bg-amber-50 border border-amber-200 rounded font-bold text-amber-950 text-center tabular-nums">
                        {val >= 1000 ? val.toFixed(0) : val.toFixed(1)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-100 border border-indigo-200 inline-block" />
                Diagonal a_{'{ii}'}: Varianzas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-white border border-slate-200 inline-block" />
                Fuera de diagonal a_{'{ij}'}: Covarianzas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-200 inline-block" />
                Vector b: Demanda de liquidez
              </span>
            </div>
          </div>

          {/* Mathematical Interpretation of Coefficients */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-indigo-600" />
                Interpretación Financiera de los Coeficientes
              </h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Coeficientes Diagonales a_ii:</span>
                  Representan la varianza empírica individual del activo <span className="font-mono">x_i</span> más la penalización por aversión al riesgo <span className="font-mono">γ</span>. Un valor alto indica alta volatilidad intrínseca.
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Coeficientes Cruzados a_ij (i ≠ j):</span>
                  Representan la covarianza estadística mutua entre el activo <span className="font-mono">x_i</span> y el activo <span className="font-mono">x_j</span>. Por ley estadística, la correlación es bidireccional, garantizando simetría rigurosa <span className="font-mono">a_ij = a_ji</span>.
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-0.5">Vector Términos Independientes b_i:</span>
                  Representa el flujo de caja neto exigido, rendimientos comprometidos o requerimientos mínimos de liquidez para cada clase de activo.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formal Proof Card: Sylvester and Eigenvalues */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Demostración Formal de Propiedades de la Matriz A
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verificación matemática instantánea de Simetría y Definición Positiva (Requisito Sección 6.1)
              </p>
            </div>
            <div>
              {validation.isValid ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Matriz Válida (Simétrica y Definida Positiva)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-md border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Matriz Inválida para GCP</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Condition 1: Symmetry */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">1. Simetría: A = Aᵀ</span>
                {validation.isSymmetric ? (
                  <span className="text-[11px] font-bold text-emerald-600">Cumple ✓</span>
                ) : (
                  <span className="text-[11px] font-bold text-red-600">Falla ✗</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                {validation.isSymmetric
                  ? 'Todos los coeficientes fuera de la diagonal cumplen |a_ij - a_ji| < 10⁻⁷.'
                  : 'Existen elementos asimétricos |a_ij - a_ji| > 10⁻⁷. Se viola el supuesto de simetría.'}
              </p>
            </div>

            {/* Condition 2: Sylvester's Criterion */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">2. Criterio de Sylvester</span>
                {validation.isPositiveDefinite ? (
                  <span className="text-[11px] font-bold text-emerald-600">det(Aₖ) &gt; 0 ✓</span>
                ) : (
                  <span className="text-[11px] font-bold text-red-600">Falla ✗</span>
                )}
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                {validation.sylvesterMinors.map((minor, k) => (
                  <div key={k} className="flex justify-between">
                    <span>det(A_{k + 1}):</span>
                    <span className={`font-semibold tabular-nums ${minor > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {minor >= 1e6 ? minor.toExponential(3) : minor.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition 3: Spectrum & Condition Number */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900">3. Espectro y Condición</span>
                <span className="text-[11px] font-mono text-slate-500">λᵢ &gt; 0</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span>λ_mín:</span>
                  <span className="font-semibold text-indigo-700 tabular-nums">
                    {validation.eigenvalues[0]?.toFixed(4) || '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>λ_máx:</span>
                  <span className="font-semibold text-indigo-700 tabular-nums">
                    {validation.eigenvalues[validation.eigenvalues.length - 1]?.toFixed(4) || '—'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-900">κ(A) = λ_máx / λ_mín:</span>
                  <span className="font-bold text-indigo-900 tabular-nums">
                    {validation.eigenvalues[0] && validation.eigenvalues[0] > 0
                      ? (
                          validation.eigenvalues[validation.eigenvalues.length - 1] /
                          validation.eigenvalues[0]
                        ).toFixed(2)
                      : '∞'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
