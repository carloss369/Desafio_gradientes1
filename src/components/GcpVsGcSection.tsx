import React, { useState } from 'react';
import { FinancialVariable, SolverResult } from '../types/financial';
import { GitCompare, CheckCircle2, TrendingDown, Clock, Activity, ChevronRight } from 'lucide-react';

interface GcpVsGcSectionProps {
  pcgResult: SolverResult;
  cgResult: SolverResult;
  tolerance: number;
  variables: FinancialVariable[];
}

export const GcpVsGcSection: React.FC<GcpVsGcSectionProps> = ({
  pcgResult,
  cgResult,
  tolerance,
  variables,
}) => {
  const [selectedTab, setSelectedTab] = useState<'pcg' | 'cg' | 'ambos'>('pcg');

  const maxIter = Math.max(pcgResult.history.length, cgResult.history.length);

  // SVG Chart dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 30, right: 40, bottom: 45, left: 65 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Log scale calculation for residual: min log10(relRes) to 0
  const minLog = Math.min(
    Math.log10(tolerance) - 1.5,
    ...pcgResult.history.map(h => Math.log10(Math.max(h.relativeResidual, 1e-16))),
    ...cgResult.history.map(h => Math.log10(Math.max(h.relativeResidual, 1e-16)))
  );
  const maxLog = 0.5;

  const getX = (k: number) => {
    if (maxIter <= 1) return padding.left;
    return padding.left + (k / (maxIter - 1)) * plotWidth;
  };

  const getY = (relRes: number) => {
    const logVal = Math.log10(Math.max(relRes, 1e-16));
    const clampedLog = Math.max(minLog, Math.min(maxLog, logVal));
    const ratio = (clampedLog - minLog) / (maxLog - minLog);
    return padding.top + (1 - ratio) * plotHeight;
  };

  // Build SVG path strings
  const pcgPath = pcgResult.history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(h.k)} ${getY(h.relativeResidual)}`)
    .join(' ');

  const cgPath = cgResult.history
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${getX(h.k)} ${getY(h.relativeResidual)}`)
    .join(' ');

  const tolY = getY(tolerance);

  return (
    <section id="gcp-vs-gc" className="py-12 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">SECCIÓN 7 · MÉTODO ITERATIVO DE SUÑAGUA (2020)</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gradientes Conjugados Precondicionado (GCP) vs GC Simple
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Contraste de convergencia del algoritmo de Suñagua (2020) frente a Gradientes Conjugados sin precondicionar.
            Visualización paso a paso de direcciones conjugadas pₖ, tamaños de paso αₖ y decaimiento del residuo relativo.
          </p>
        </div>

        {/* Algorithm Formulation Card */}
        <div className="p-5 rounded-xl bg-slate-900 text-slate-100 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Estructura Algorítmica de Suñagua (2020) — Revista Boliviana de Matemática
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Tolerancia ||rₖ||₂ / ||b||₂ &lt; 10⁻⁶</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono text-slate-300">
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-indigo-300 font-bold block mb-1">1. Inicialización:</span>
              r₀ = b - A x₀<br />
              Resolver M z₀ = r₀<br />
              p₀ = z₀
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-indigo-300 font-bold block mb-1">2. Paso y Solución:</span>
              αₖ = (rₖᵀ zₖ) / (pₖᵀ A pₖ)<br />
              xₖ₊₁ = xₖ + αₖ pₖ<br />
              rₖ₊₁ = rₖ - αₖ A pₖ
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-indigo-300 font-bold block mb-1">3. Precondicionamiento:</span>
              Resolver M zₖ₊₁ = rₖ₊₁<br />
              βₖ = (rₖ₊₁ᵀ zₖ₊₁) / (rₖᵀ zₖ)<br />
              pₖ₊₁ = zₖ₊₁ + βₖ pₖ
            </div>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
              <span className="text-indigo-300 font-bold block mb-1">4. Criterio de Parada:</span>
              Si ||rₖ₊₁||₂ / ||b||₂ &lt; ε<br />
              Parar y retornar xₖ₊₁<br />
              Sino k = k + 1
            </div>
          </div>
        </div>

        {/* Comparison KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Iterations GCP */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
              Iteraciones GCP ({pcgResult.preconditionerName})
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-950 font-mono tabular-nums">
                {pcgResult.iterations}
              </span>
              <span className="text-xs text-indigo-700 font-medium">pasos</span>
            </div>
            <div className="text-[11px] text-indigo-800 mt-2 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Convergencia satisfecha</span>
            </div>
          </div>

          {/* Iterations GC Simple */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
              Iteraciones GC Simple (M = I)
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-950 font-mono tabular-nums">
                {cgResult.iterations}
              </span>
              <span className="text-xs text-amber-800 font-medium">pasos</span>
            </div>
            <div className="text-[11px] text-amber-800 mt-2">
              {pcgResult.iterations < cgResult.iterations ? (
                <span className="font-semibold text-emerald-700">
                  GCP ahorra {cgResult.iterations - pcgResult.iterations} iteración(es)
                </span>
              ) : (
                <span>Igual número de iteraciones</span>
              )}
            </div>
          </div>

          {/* Final Relative Residual */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Residuo Relativo Final GCP
            </div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
              {pcgResult.finalRelativeResidual.toExponential(4)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-2">
              &lt; {tolerance.toExponential(0)} (Tolerancia cumplida)
            </div>
          </div>

          {/* Execution Time */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Tiempo de Ejecución
            </div>
            <div className="flex items-baseline gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                {pcgResult.executionTimeMs.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 font-medium">ms</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Ejecutado localmente en tiempo real
            </div>
          </div>
        </div>

        {/* Convergence Log-Scale Chart */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-indigo-600" />
                Curva de Convergencia en Escala Logarítmica: log₁₀(||rₖ||₂ / ||b||₂)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comportamiento iteración por iteración hacia el umbral de tolerancia 10⁻⁶
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-indigo-600 rounded-full inline-block" />
                <span className="text-indigo-900">GCP ({pcgResult.preconditionerName})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-amber-500 rounded-full inline-block border-t border-dashed" />
                <span className="text-amber-900">GC Simple (Sin M)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-red-500 border-t border-dashed inline-block" />
                <span className="text-red-700">Tolerancia 10⁻⁶</span>
              </div>
            </div>
          </div>

          {/* SVG Plot */}
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto max-h-[300px] select-none font-mono"
            >
              {/* Grid Lines */}
              {[-8, -6, -4, -2, 0].map(val => {
                if (val < minLog || val > maxLog) return null;
                const y = getY(Math.pow(10, val));
                return (
                  <g key={val}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#64748b"
                    >
                      10^{val}
                    </text>
                  </g>
                );
              })}

              {/* X Axis ticks */}
              {Array.from({ length: maxIter }).map((_, k) => {
                const x = getX(k);
                return (
                  <g key={k}>
                    <line
                      x1={x}
                      y1={svgHeight - padding.bottom}
                      x2={x}
                      y2={svgHeight - padding.bottom + 5}
                      stroke="#94a3b8"
                    />
                    <text
                      x={x}
                      y={svgHeight - padding.bottom + 18}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#475569"
                    >
                      k={k}
                    </text>
                  </g>
                );
              })}

              {/* Tolerance Reference Line */}
              <line
                x1={padding.left}
                y1={tolY}
                x2={svgWidth - padding.right}
                y2={tolY}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
              <text
                x={svgWidth - padding.right}
                y={tolY - 6}
                textAnchor="end"
                fontSize="10"
                fill="#dc2626"
                fontWeight="bold"
              >
                Criterio 10⁻⁶
              </text>

              {/* GC Simple Path */}
              <path
                d={cgPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* GCP Path */}
              <path
                d={pcgPath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
              />

              {/* GC Points */}
              {cgResult.history.map((h, i) => (
                <circle
                  key={`cg-${i}`}
                  cx={getX(h.k)}
                  cy={getY(h.relativeResidual)}
                  r="4"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                >
                  <title>{`GC k=${h.k}: RelRes=${h.relativeResidual.toExponential(3)}`}</title>
                </circle>
              ))}

              {/* GCP Points */}
              {pcgResult.history.map((h, i) => (
                <circle
                  key={`pcg-${i}`}
                  cx={getX(h.k)}
                  cy={getY(h.relativeResidual)}
                  r="4.5"
                  fill="#4f46e5"
                  stroke="#ffffff"
                  strokeWidth="2"
                >
                  <title>{`GCP k=${h.k}: RelRes=${h.relativeResidual.toExponential(3)}`}</title>
                </circle>
              ))}

              {/* Axis labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 6}
                textAnchor="middle"
                fontSize="11"
                fill="#1e293b"
                fontWeight="bold"
              >
                Número de Iteración (k)
              </text>
            </svg>
          </div>
        </div>

        {/* Step-by-Step Iteration Table */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Historial Detallado Paso a Paso de las Iteraciones
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Valores exactos de αₖ, βₖ, residuo euclidiano ||rₖ||₂ y vector solución aproximado en cada paso
              </p>
            </div>

            {/* Filter tab buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedTab('pcg')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedTab === 'pcg'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                GCP ({pcgResult.history.length} pasos)
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('cg')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  selectedTab === 'cg'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                GC Simple ({cgResult.history.length} pasos)
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3 w-16">Paso k</th>
                  <th className="py-2.5 px-3">||rₖ||₂ (Norma)</th>
                  <th className="py-2.5 px-3">||rₖ||₂ / ||b||₂ (Relativo)</th>
                  <th className="py-2.5 px-3">Paso αₖ</th>
                  <th className="py-2.5 px-3">Conjugación βₖ</th>
                  <th className="py-2.5 px-3">Vector Aproximado xₖ [x₁ .. xₙ]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(selectedTab === 'pcg' ? pcgResult.history : cgResult.history).map((step, idx) => {
                  const isConverged = step.relativeResidual < tolerance;
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 transition-colors ${
                        isConverged ? 'bg-emerald-50/40 font-semibold' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        k = {step.k}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 tabular-nums">
                        {step.residualNorm.toExponential(4)}
                      </td>
                      <td className="py-2.5 px-3 tabular-nums">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            isConverged
                              ? 'bg-emerald-100 text-emerald-800 font-bold'
                              : 'text-slate-700'
                          }`}
                        >
                          {step.relativeResidual.toExponential(4)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 tabular-nums">
                        {step.alpha !== undefined ? step.alpha.toFixed(6) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 tabular-nums">
                        {step.beta !== undefined ? step.beta.toFixed(6) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-900 font-medium tabular-nums">
                        [{step.xk.map(v => v.toFixed(4)).join(', ')}]
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
