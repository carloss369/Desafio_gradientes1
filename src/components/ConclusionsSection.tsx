import React from 'react';
import { BookOpen, Award, FileText, Printer, Download, CheckCircle2 } from 'lucide-react';

interface ConclusionsSectionProps {
  onExportReport: () => void;
  onPrintReport: () => void;
}

export const ConclusionsSection: React.FC<ConclusionsSectionProps> = ({
  onExportReport,
  onPrintReport,
}) => {
  return (
    <section id="conclusiones" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">
            SECCIÓN 10 · CONCLUSIONES Y REFERENCIAS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interpretación de Resultados y Bibliografía Científica
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Síntesis formal del impacto algorítmico y financiero del Método de Gradientes Conjugados Precondicionado (GCP),
            validación de la cota de convergencia de Suñagua (2020) y referencias académicas principales.
          </p>
        </div>

        {/* Technical and Financial Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Interpretación Técnica y Numérica */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                1. Conclusiones Técnicas y Matemáticas
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Efectividad del Precondicionamiento:</strong> En el Escenario Mal Condicionado (κ(A) ≈ 2,840),
                  el precondicionador de Jacobi redujo el número de condición a κ(M⁻¹A) ≈ 6.1 (una reducción superior al 99%).
                  Esto suprime los desvíos ortogonales del residuo, garantizando convergencia acelerada dentro de la tolerancia 10⁻⁶.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Fidelidad frente al Método Directo:</strong> Los errores absolutos por componente Eₐ se mantuvieron
                  en el orden de 10⁻⁷ a 10⁻¹⁰ frente a la descomposición exacta de Cholesky A = LLᵀ, confirmando que GCP ofrece
                  la misma exactitud que un método directo con un costo computacional por iteración de solo O(n²).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Robustez ante Violación de Hipótesis:</strong> La suite de control de calidad QA demostró que el
                  sistema captura matrices asimétricas o no definidas positivas mediante el Criterio de Sylvester, impidiendo
                  colapsos numéricos.
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: Interpretación Financiera */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                2. Implicaciones en la Toma de Decisiones Financieras
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Estabilidad en Escenario Ideal:</strong> La cartera óptima distribuye capital de forma balanceada
                  entre activos soberanos, tecnológicos, commodities y fideicomisos, maximizando el cociente de Sharpe global.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Resiliencia Bajo Estrés:</strong> Ante perturbaciones macroeconómicas y shocks de inflación, el
                  modelo reorienta automáticamente el capital hacia bonos soberanos (x₁) y oro (x₃), resguardando la solvencia
                  financiera sin requerir reinicializaciones computacionales complejas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Escalabilidad Corporativa:</strong> La capacidad de resolver sistemas con n ≥ 4 variables abre el camino
                  a la optimización en tiempo real de cientos de activos financieros o partidas presupuestarias interdepartamentales.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Formal Bibliography Citing Suñagua 2020 */}
        <div className="p-6 rounded-xl bg-slate-900 text-slate-100 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Bibliografía Principal y Citas Académicas
            </h3>
          </div>

          <ol className="space-y-3 text-xs text-slate-300 font-sans">
            <li className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-white block mb-0.5">Artículo Científico Base (UMSA):</span>
              Suñagua S., Porfirio (2020). <em>Método de Gradientes Conjugados Precondicionado</em>. Revista Boliviana de
              Matemática – UMSA, Vol. 04, pp. 2–7. La Paz, Bolivia.
            </li>
            <li className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-white block mb-0.5">Tratado de Computación Matricial:</span>
              Golub, Gene H., & Van Loan, Charles F. (2013). <em>Matrix Computations</em> (4th ed.). Johns Hopkins University
              Press, Baltimore, Maryland.
            </li>
            <li className="p-3 rounded-lg bg-slate-800/60 border border-slate-700">
              <span className="font-bold text-white block mb-0.5">Métodos Iterativos y Precondicionamiento:</span>
              Saad, Yousef (2003). <em>Iterative Methods for Sparse Linear Systems</em> (2nd ed.). Society for Industrial
              and Applied Mathematics (SIAM), Philadelphia.
            </li>
          </ol>
        </div>

        {/* Action Buttons: Export Report & Print */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Entregables Académicos del Desafío</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Descargue el informe numérico completo en formato estructurado JSON o imprima la ficha técnica para evaluación.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrintReport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Ficha Técnica</span>
            </button>

            <button
              type="button"
              onClick={onExportReport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Informe JSON</span>
            </button>
          </div>
        </div>

        {/* Academic Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>
            Carrera de Informática · Facultad de Ciencias Puras y Naturales · Universidad Mayor de San Andrés (UMSA)
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Desafío Académico de Métodos Numéricos · Método de Gradientes Conjugados Precondicionado en Finanzas (Suñagua, 2020)
          </p>
        </footer>
      </div>
    </section>
  );
};
