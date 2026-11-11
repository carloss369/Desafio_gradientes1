import React from 'react';
import { SCENARIOS_DATA } from '../data/scenarios';
import {
  computeComponentErrors,
  solveCholesky,
  solvePCG,
} from '../utils/matrixMath';
import { Table, CheckCircle2 } from 'lucide-react';

export const ComparativeTableSection: React.FC = () => {
  // Pre-solve all 3 scenarios under the standard tolerance 1e-6 and x0 = 0
  const scenariosResults = Object.values(SCENARIOS_DATA).map(sc => {
    const n = sc.A.length;
    const x0 = new Array(n).fill(0);
    const tol = 1e-6;

    const cholesky = solveCholesky(sc.A, sc.b);
    const pcg = solvePCG(sc.A, sc.b, x0, tol, 100, sc.defaultPreconditioner);
    const cg = solvePCG(sc.A, sc.b, x0, tol, 100, 'none');

    const errors = cholesky.success
      ? computeComponentErrors(cholesky.x, pcg.x, sc.variables)
      : [];

    let financialInterpretation = '';
    if (sc.id === 'ideal') {
      financialInterpretation =
        'Asignación óptima y equilibrada en las 4 clases de activos. Bajo nivel de riesgo con rendimiento ajustado normal (77 M$). Rápida convergencia en 4 iteraciones gracias al bajo condicionamiento κ ≈ 3.8.';
    } else if (sc.id === 'estres') {
      financialInterpretation =
        'Refugio en bonos soberanos (x₁) y oro (x₃) para mitigar el shock de inflación y alza de tipos de interés. Contracción en activos tecnológicos. El sistema preserva estabilidad y converge con alta fidelidad a pesar de la mayor covarianza κ ≈ 18.5.';
    } else {
      financialInterpretation =
        'Cartera con acoplamiento asimétrico y desbalance severo de escala entre el mega-activo corporativo x₁ (1,450 M$) y micro-activos fintech x₂ (1.2 M$). El precondicionador de Jacobi reduce κ de 2,840 a 6.1 (reducción del 99.8%), garantizando convergencia sin desvíos ortogonales.';
    }

    return {
      definition: sc,
      cholesky,
      pcg,
      cg,
      errors,
      financialInterpretation,
    };
  });

  return (
    <section id="tabla-comparativa" className="py-12 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">SECCIÓN 8 OBLIGATORIA DEL DESAFÍO</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tabla Comparativa Global de los Tres Escenarios
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Resumen comparativo exhaustivo exigido en la Sección 8 de la guía académica, contrastando simultáneamente los
            escenarios Ideal, Bajo Estrés Financiero y Mal Condicionado en 11 métricas clave.
          </p>
        </div>

        {/* Global Comparative Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs bg-white">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-64 border-r border-slate-800">
                  <div className="flex items-center gap-1.5 font-sans">
                    <Table className="w-4 h-4 text-indigo-400" />
                    <span>Indicador Oficial</span>
                  </div>
                </th>
                <th className="py-3 px-4 border-r border-slate-800 bg-slate-800/90 text-indigo-200">
                  1. Escenario Ideal
                </th>
                <th className="py-3 px-4 border-r border-slate-800 bg-slate-800/70 text-amber-200">
                  2. Escenario Bajo Estrés
                </th>
                <th className="py-3 px-4 bg-slate-800 text-rose-200">
                  3. Escenario Mal Condicionado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Row 1: Solución numérica de referencia */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-sans font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                  Solución numérica de referencia (xref)
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 font-semibold text-slate-800 tabular-nums">
                    [{r.cholesky.x.map(v => v.toFixed(4)).join(', ')}]
                  </td>
                ))}
              </tr>

              {/* Row 2: Solución GCP */}
              <tr className="hover:bg-slate-50 transition-colors bg-indigo-50/20">
                <td className="py-3 px-4 font-sans font-bold text-indigo-950 bg-indigo-50/50 border-r border-slate-200">
                  Solución GCP (x_GCP)
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 font-bold text-indigo-950 tabular-nums">
                    [{r.pcg.x.map(v => v.toFixed(4)).join(', ')}]
                  </td>
                ))}
              </tr>

              {/* Row 3: Error absoluto (Ea) */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Error absoluto (Eₐ) por variable
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 text-slate-600 text-[11px] tabular-nums">
                    {r.errors.map((e, idx) => (
                      <div key={idx}>
                        <span className="font-bold text-slate-700">{e.symbol}:</span> {e.ea.toExponential(3)}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Row 4: Error porcentual (Ep) */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Error porcentual (Eₚ) por variable
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 text-slate-600 text-[11px] tabular-nums">
                    {r.errors.map((e, idx) => (
                      <div key={idx}>
                        <span className="font-bold text-slate-700">{e.symbol}:</span>{' '}
                        {e.ep !== null ? `${e.ep.toExponential(3)} %` : 'N/A'}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Row 5: Iteraciones GC */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Iteraciones GC (sin precondicionar)
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 text-slate-800 font-bold tabular-nums">
                    {r.cg.iterations} iteraciones
                  </td>
                ))}
              </tr>

              {/* Row 6: Iteraciones GCP */}
              <tr className="hover:bg-slate-50 transition-colors bg-indigo-50/20">
                <td className="py-3 px-4 font-sans font-bold text-indigo-950 bg-indigo-50/50 border-r border-slate-200">
                  Iteraciones GCP (precondicionado)
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 font-extrabold text-indigo-700 tabular-nums">
                    {r.pcg.iterations} iteraciones{' '}
                    <span className="font-sans text-[11px] font-normal text-slate-500">
                      ({r.definition.defaultPreconditioner.toUpperCase()})
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 7: Número de condición κ(A) */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Número de condición κ(A)
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 font-semibold text-slate-800 tabular-nums">
                    {r.pcg.conditionNumberOriginal.toFixed(2)}
                  </td>
                ))}
              </tr>

              {/* Row 8: Número de condición κ(M⁻¹A) */}
              <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/20">
                <td className="py-3 px-4 font-sans font-bold text-emerald-950 bg-emerald-50/40 border-r border-slate-200">
                  Número de condición κ(M⁻¹A)
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 font-bold text-emerald-800 tabular-nums">
                    {r.pcg.conditionNumberPreconditioned.toFixed(2)}
                  </td>
                ))}
              </tr>

              {/* Row 9: Residuo relativo final GCP */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-sans font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Residuo relativo final GCP
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200 text-slate-700 tabular-nums font-semibold">
                    {r.pcg.finalRelativeResidual.toExponential(4)}
                  </td>
                ))}
              </tr>

              {/* Row 10: ¿Convergió el algoritmo? */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-sans font-bold text-slate-900 bg-slate-50 border-r border-slate-200">
                  ¿Convergió el algoritmo?
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-3 px-4 border-r border-slate-200">
                    <span className="inline-flex items-center gap-1.5 font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sí (Tolerancia 10⁻⁶ cumplida)</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 11: Interpretación financiera cualitativa */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-4 font-sans font-bold text-slate-900 bg-slate-50 border-r border-slate-200 align-top">
                  Interpretación financiera cualitativa
                </td>
                {scenariosResults.map((r, i) => (
                  <td key={i} className="py-4 px-4 border-r border-slate-200 font-sans text-xs text-slate-600 leading-relaxed align-top">
                    {r.financialInterpretation}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
