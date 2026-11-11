import React from 'react';
import { Download, GraduationCap, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onExportReport: () => void;
  onResetToDefault: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportReport, onResetToDefault }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <a href="#inicio" className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg tracking-tight whitespace-nowrap shrink-0">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono text-sm font-semibold shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </span>
            <span>UMSA · Informática Finanzas GCP</span>
          </a>

          {/* Zone 2: Concise navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#caso-estudio" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Caso de Estudio
            </a>
            <a href="#formulacion" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Formulación Ax=b
            </a>
            <a href="#simulador" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Simulador GCP
            </a>
            <a href="#tabla-comparativa" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Tabla 3 Escenarios
            </a>
            <a href="#modulo-qa" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Módulo QA
            </a>
            <a href="#conclusiones" className="hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0">
              Conclusiones
            </a>
          </nav>

          {/* Zone 3: Primary Action buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onResetToDefault}
              title="Restaurar parámetros por defecto"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onExportReport}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Reporte</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
