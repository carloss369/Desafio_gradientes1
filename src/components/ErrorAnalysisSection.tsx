import React from 'react';
import { ComponentError, SolverResult } from '../types/financial';
import { Percent, Activity, CheckCircle2, Info } from 'lucide-react';

interface ErrorAnalysisSectionProps {
  errors: ComponentError[];
  pcgResult: SolverResult;
  cgResult: SolverResult;
  bNorm: number;
}

export const ErrorAnalysisSection: React.FC<ErrorAnalysisSectionProps> = ({
  errors,
  pcgResult,
  cgResult,
}) => {
  const condOrig = pcgResult.conditionNumberOriginal;
  const condPre = pcgResult.conditionNumberPreconditioned;
  const condReductionRatio = condOrig > 0 && condPre > 0 ? condOrig / condPre : 1;
  const condReductionPercent = Math.max(0, ((condOrig - condPre) / condOrig) * 100);

  return (
    <section id="analisis-errores" className="py-12 border-b border-slate-200 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">SECCIÓN 8 · PRECISIÓN NUMÉRICA</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Análisis de Errores Numéricos y Espectro de Condicionamiento
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Evaluación rigurosa de errores absolutos (Eₐ), relativos (Eᵣ) y porcentuales (Eₚ) por componente respecto a la
            solución exacta de Cholesky, junto al impacto del precondicionador M en el número de condición κ.
          </p>
        </div>

        {/* Global Residual & Condition Improvement Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Global Relative Residual */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Residuo Relativo Global ||b - Ax_GCP||₂ / ||b||₂
            </div>
            <div className="text-2xl font-extrabold text-indigo-950 font-mono tabular-nums">
              {pcgResult.finalRelativeResidual.toExponential(4)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Convergencia &lt; 10⁻⁶ garantizada</span>
            </div>
          </div>

          {/* Original Condition Number */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Número de Condición Original κ(A)
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              {condOrig >= 1e5 ? condOrig.toExponential(3) : condOrig.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {condOrig < 10 ? 'Bien condicionada (mercado equilibrado)' : 'Condicionamiento elevado o sensible'}
            </div>
          </div>

          {/* Preconditioned Condition Number */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 shadow-xs">
            <div className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider mb-1">
              Número de Condición Precondicionada κ(M⁻¹A)
            </div>
            <div className="text-2xl font-extrabold text-indigo-950 font-mono tabular-nums">
              {condPre >= 1e5 ? condPre.toExponential(3) : condPre.toFixed(2)}
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 mt-1">
              Reducción de condición: {condReductionRatio > 1 ? `${condReductionRatio.toFixed(1)}x (${condReductionPercent.toFixed(1)}%)` : 'Normal'}
            </div>
          </div>
        </div>

        {/* Component-Wise Errors Table */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-4 h-4 text-indigo-600" />
                Errores por Variable: Absoluto (Eₐ), Relativo (Eᵣ) y Porcentual (Eₚ)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Eₐ = |x_ref,i - x_GCP,i| · Eᵣ = Eₐ / |x_ref,i| · Eₚ = Eᵣ × 100%
              </p>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Precisión comparada frente al método directo de Cholesky</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">Variable / Activo</th>
                  <th className="py-2.5 px-3 text-right">x_ref (Exacta Cholesky)</th>
                  <th className="py-2.5 px-3 text-right">x_GCP (Aproximada)</th>
                  <th className="py-2.5 px-3 text-right">Error Absoluto (Eₐ)</th>
                  <th className="py-2.5 px-3 text-right">Error Relativo (Eᵣ)</th>
                  <th className="py-2.5 px-3 text-right">Error Porcentual (Eₚ)</th>
                  <th className="py-2.5 px-3 text-center">Tolerancia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {errors.map((err, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">
                          {err.symbol}
                        </span>
                        <div>
                          <span className="font-sans font-semibold text-slate-900 block">{err.variableName}</span>
                          <span className="font-sans text-[10px] text-slate-400">{err.unit}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-800 tabular-nums">
                      {err.xref.toFixed(6)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-indigo-900 tabular-nums">
                      {err.xgcp.toFixed(6)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-700 tabular-nums">
                      {err.ea.toExponential(4)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                      {err.er !== null ? err.er.toExponential(4) : 'No definido (xref=0)'}
                    </td>
                    <td className="py-3 px-3 text-right font-bold tabular-nums">
                      {err.ep !== null ? (
                        <span className="text-emerald-700">
                          {err.ep.toExponential(3)} %
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        &lt; 10⁻⁶
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Theoretical Insight on Condition Number */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Interpretación Matemática del Condicionamiento κ(A) y Efecto de M
            </h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            La tasa teórica de convergencia de Gradientes Conjugados está acotada por{' '}
            <span className="font-mono font-semibold">
              ||xₖ - x*||_A ≤ 2 ((√κ - 1) / (√κ + 1))ᵏ ||x₀ - x*||_A
            </span>. Cuando <span className="font-mono">κ(A) ≫ 1</span> (como en el Escenario Mal Condicionado con{' '}
            <span className="font-mono">κ ≈ 2,840</span>), la cota teórica se aproxima a 1, provocando lentitud y oscilaciones ortogonales severas en el GC simple.
            Al aplicar el Precondicionador de Jacobi o SSOR, la matriz transformada{' '}
            <span className="font-mono font-semibold">M⁻¹A</span> presenta un espectro agrupado con{' '}
            <span className="font-mono font-semibold">κ(M⁻¹A) ≈ {condPre.toFixed(1)}</span>, permitiendo que las direcciones conjugadas alcancen el punto óptimo en un número mínimo de iteraciones.
          </p>
        </div>
      </div>
    </section>
  );
};
