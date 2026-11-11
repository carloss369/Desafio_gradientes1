import React from 'react';
import { AcademicMention } from '../types/financial';
import { ACADEMIC_MENTIONS } from '../data/scenarios';
import { BookOpen, Sparkles, TrendingUp, Cpu, Layers } from 'lucide-react';

interface HeroSectionProps {
  selectedMention: AcademicMention;
  onSelectMention: (m: AcademicMention) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedMention,
  onSelectMention,
}) => {
  const activeMentionInfo = ACADEMIC_MENTIONS[selectedMention];

  return (
    <section id="inicio" className="pt-8 pb-12 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Institutional Kicker & Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 mb-4">
          <span className="font-semibold text-indigo-700">UNIVERSIDAD MAYOR DE SAN ANDRÉS</span>
          <span aria-hidden="true">·</span>
          <span>Facultad de Ciencias Puras y Naturales</span>
          <span aria-hidden="true">·</span>
          <span>Carrera de Informática</span>
          <span aria-hidden="true">·</span>
          <span>Métodos Numéricos</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-4xl mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Aplicación del Método de Gradientes Conjugados Precondicionado en Problemas Financieros
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Plataforma interactiva para la resolución rigurosa de sistemas lineales simétricos definidos positivos{' '}
            <span className="font-mono font-semibold text-slate-800">Ax = b</span> con{' '}
            <span className="font-mono font-semibold text-slate-800">n ≥ 4</span>, evaluación de tolerancia{' '}
            <span className="font-mono font-semibold text-slate-800">10⁻⁶</span>, descomposición directa de Cholesky y
            análisis espectral de tres escenarios financieros (Ideal, Estrés y Mal Condicionado).
          </p>
        </div>

        {/* Paper Citation Card & Key Parameters */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 tracking-wider">FUNDAMENTO CIENTÍFICO</div>
              <p className="text-sm font-medium text-slate-800 mt-0.5">
                Suñagua S., Porfirio (2020). <em>Método de Gradientes Conjugados Precondicionado</em>. Revista Boliviana de Matemática – UMSA, Vol. 04, pp. 2–7.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 divide-x divide-slate-300">
            <div className="pr-4">
              <div className="text-slate-400">Modalidad</div>
              <div className="font-semibold text-slate-900">Individual</div>
            </div>
            <div className="px-4">
              <div className="text-slate-400">Dimensión mínima</div>
              <div className="font-semibold text-slate-900 font-mono">n ≥ 4 (4×4)</div>
            </div>
            <div className="pl-4">
              <div className="text-slate-400">Criterio de parada</div>
              <div className="font-semibold text-slate-900 font-mono">||rₖ||₂ / ||b||₂ &lt; 10⁻⁶</div>
            </div>
          </div>
        </div>

        {/* Academic Mentions Selector */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold tracking-tight text-slate-900">
              Menciones Académicas de la Carrera de Informática
            </h2>
            <span className="text-xs text-slate-500">Selecciona la mención para contextualizar el modelo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Mention 1: IA y Ciencia de Datos */}
            <button
              type="button"
              onClick={() => onSelectMention('ia_ciencia_datos')}
              className={`p-4 rounded-xl text-left transition-all border ${
                selectedMention === 'ia_ciencia_datos'
                  ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className={`w-4 h-4 ${selectedMention === 'ia_ciencia_datos' ? 'text-indigo-600' : 'text-slate-500'}`} />
                <h3 className="text-sm font-bold text-slate-900">IA y Ciencia de Datos</h3>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                Cartera de activos (n ≥ 4), matrices de covarianza empírica, aversión al riesgo y análisis de sensibilidad.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-indigo-700">
                Énfasis: Min. Riesgo Cuadrático & Covarianza
              </div>
            </button>

            {/* Mention 2: Ingeniería de Sistemas */}
            <button
              type="button"
              onClick={() => onSelectMention('ingenieria_sistemas')}
              className={`p-4 rounded-xl text-left transition-all border ${
                selectedMention === 'ingenieria_sistemas'
                  ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Layers className={`w-4 h-4 ${selectedMention === 'ingenieria_sistemas' ? 'text-indigo-600' : 'text-slate-500'}`} />
                <h3 className="text-sm font-bold text-slate-900">Ingeniería de Sistemas</h3>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                Planificación financiera, distribución de recursos y flujos de caja interdepartamentales corporativos.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-indigo-700">
                Énfasis: Procesos Organizacionales & Sinergias
              </div>
            </button>

            {/* Mention 3: Desarrollo de Sistemas */}
            <button
              type="button"
              onClick={() => onSelectMention('desarrollo_sistemas')}
              className={`p-4 rounded-xl text-left transition-all border ${
                selectedMention === 'desarrollo_sistemas'
                  ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-1 ring-indigo-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Cpu className={`w-4 h-4 ${selectedMention === 'desarrollo_sistemas' ? 'text-indigo-600' : 'text-slate-500'}`} />
                <h3 className="text-sm font-bold text-slate-900">Desarrollo de Sistemas</h3>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                Simulador de presupuestos IT, asignación en la nube (GPU, SaaS, SRE), arquitectura y pruebas QA funcionales.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-indigo-700">
                Énfasis: Arquitectura Web & Validación Numérica
              </div>
            </button>
          </div>

          {/* Active Mention Context Box */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-900">Caso Activo: </span>
              <span>{activeMentionInfo.caseTitle}</span>
            </div>
            <div className="text-slate-500 italic">
              Fuente de datos: {activeMentionInfo.dataOrigin}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
