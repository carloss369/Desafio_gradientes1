import React from 'react';
import { AcademicMention } from '../types/financial';
import { ACADEMIC_MENTIONS } from '../data/scenarios';
import { ShieldCheck, Database, Scale, BarChart3 } from 'lucide-react';

interface CaseStudySectionProps {
  selectedMention: AcademicMention;
}

export const CaseStudySection: React.FC<CaseStudySectionProps> = ({ selectedMention }) => {
  const mentionInfo = ACADEMIC_MENTIONS[selectedMention];

  return (
    <section id="caso-estudio" className="py-12 border-b border-slate-200 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-semibold text-indigo-700 tracking-wider mb-1">SECCIÓN 2 · MARCO CONCEPTUAL</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Caso de Estudio y Justificación Financiera
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Fundamentación económica del modelo matricial simétrico definido positivo{' '}
            <span className="font-mono font-medium">Ax = b</span> aplicado a {mentionInfo.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Contexto Financiero & Modelo Cuadrático */}
          <div className="p-6 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Modelo Matemático Financiero</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              En la teoría moderna de carteras (Markowitz) y asignación presupuestaria, el inversor busca minimizar el riesgo total
              de la cartera sujeto a satisfacer una meta de rendimiento y liquidez requerida. La función objetivo cuadrática es:
            </p>
            <div className="my-3 p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-center text-slate-800">
              f(x) = ½ xᵀ A x - bᵀ x
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              El mínimo global se alcanza cuando el gradiente se anula:{' '}
              <span className="font-mono font-semibold text-slate-800">∇f(x) = Ax - b = 0</span>, lo que conduce exactamente
              al sistema de ecuaciones lineales <span className="font-mono font-semibold text-slate-800">Ax = b</span>.
            </p>
          </div>

          {/* Card 2: Justificación de Simetría y Definición Positiva */}
          <div className="p-6 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Simetría y Definición Positiva</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              La matriz <span className="font-mono font-semibold">A = Σ + γ I</span> está construida a partir de la matriz de covarianzas empíricas{' '}
              <span className="font-mono">Σ</span> entre activos y un término de regularización de Tikhonov{' '}
              <span className="font-mono">γ &gt; 0</span> (aversión al riesgo):
            </p>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-800">1. Simetría (A = Aᵀ):</span>
                <span>La covarianza entre el activo i y el activo j es idéntica a la covarianza entre j e i (Cov(Xᵢ, Xⱼ) = Cov(Xⱼ, Xᵢ)).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-800">2. Definida Positiva (xᵀAx &gt; 0):</span>
                <span>Toda varianza de una cartera no nula es estrictamente positiva: xᵀΣx ≥ 0 y con γ &gt; 0, xᵀAx ≥ γ ||x||² &gt; 0.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Procedencia de los Datos & Calidad */}
          <div className="p-6 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Procedencia de los Datos</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los coeficientes del modelo están calibrados a partir de magnitudes financieras reales de mercado y registros institucionales:
            </p>
            <div className="mt-3 space-y-2 text-xs text-slate-700">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900">Series Históricas Auditadas</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{mentionInfo.dataOrigin}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-900">Vector de Demanda b</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Metas de retorno neto y requerimientos mínimos de liquidez para tesorería.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Scenarios Rationale */}
        <div className="mt-6 p-5 rounded-xl bg-indigo-50/40 border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-indigo-700" />
            <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Consistencia y Modificación Estructurada de los Tres Escenarios
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Los tres escenarios comparten idénticas variables financieras ($x_1, x_2, x_3, x_4$) manteniendo la estructura
            general del modelo cuadrático. El escenario <strong>Ideal</strong> modela calma y baja correlación; el escenario{' '}
            <strong>Bajo Estrés</strong> incrementa la volatilidad y los requerimientos de liquidez por shock macroeconómico; y el escenario{' '}
            <strong>Mal Condicionado</strong> reproduce disparidades de escala extrema entre macro-activos institucionales y micro-activos fintech,
            demostrando la necesidad y efectividad del precondicionador de Suñagua (2020).
          </p>
        </div>
      </div>
    </section>
  );
};
