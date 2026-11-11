import React, { useState } from 'react';
import { Download, GraduationCap, RefreshCw, Github, Copy, Check, ExternalLink, X, Code2 } from 'lucide-react';

interface HeaderProps {
  onExportReport: () => void;
  onResetToDefault: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportReport, onResetToDefault }) => {
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);

  const sharedAppUrl = 'https://ais-pre-5j3elmjcj75wsnyrl7oru7-345852126013.us-east5.run.app';

  const gitCommands = `# 1. En tu cuenta de GitHub, crea un nuevo repositorio (ej. "desafio-gcp-umsa")
# 2. Conecta tu repositorio remoto y sube el código:
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main`;

  const copyAppUrl = () => {
    navigator.clipboard.writeText(sharedAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  return (
    <>
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
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowGithubModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Cómo subir el código y entregar en GitHub"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">Subir a GitHub</span>
              </button>

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

      {/* GitHub & Deliverables Instructions Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
              <div className="flex items-center gap-2">
                <Github className="w-6 h-6 text-slate-900" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Instrucciones para Subir a GitHub y Entregables UMSA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rúbrica de Evaluación (100 puntos): Página web pública y repositorio con README.md
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Entregable 1: Enlace Público */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Entregable 1: Enlace Público de la Página Web Funcional
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Activo y Accesible
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Este es el enlace público permanente que debes entregar para la evaluación (no requiere credenciales):
                </p>
                <div className="flex items-center gap-2 p-2.5 bg-white border border-indigo-200 rounded-lg">
                  <input
                    type="text"
                    readOnly
                    value={sharedAppUrl}
                    className="w-full text-xs font-mono text-indigo-950 bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={copyAppUrl}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow-xs shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copiado' : 'Copiar Enlace'}</span>
                  </button>
                </div>
              </div>

              {/* Entregable 2: Repositorio GitHub */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">
                  Entregable 2: Repositorio de Código Fuente en GitHub / GitLab
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  El repositorio ya cuenta con el archivo <strong className="text-slate-800">README.md</strong> detallado
                  con toda la fundamentación matemática, arquitectura, comandos de instalación local y el historial de commits inicial.
                </p>

                {/* Método 1: Exportar desde Google AI Studio UI */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                    <h5 className="text-xs font-bold text-slate-900">
                      Método Directo: Botón de Exportar en Google AI Studio
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                    En la esquina superior derecha de la interfaz de <strong>Google AI Studio</strong>, haz clic en el botón con ícono de <strong>GitHub / Export</strong> (o menú de tres puntos). Selecciona <em>"Export to GitHub"</em> y elige tu cuenta para que AI Studio cree el repositorio automáticamente.
                  </p>
                </div>

                {/* Método 2: Comandos Git para subir tu repo */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                      <h5 className="text-xs font-bold text-slate-900">
                        Método por Terminal / Git Push
                      </h5>
                    </div>
                    <button
                      type="button"
                      onClick={copyCommands}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900"
                    >
                      {copiedCommands ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCommands ? 'Comandos Copiados' : 'Copiar Comandos'}</span>
                    </button>
                  </div>

                  <ol className="text-xs text-slate-600 pl-7 space-y-2 mb-3 list-decimal">
                    <li>Entra a <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a> y crea un repositorio público (ejemplo: <code>desafio-gcp-umsa</code>) <strong>sin inicializar con README</strong>.</li>
                    <li>Ejecuta en tu terminal los siguientes comandos vinculando tu URL de GitHub:</li>
                  </ol>

                  <div className="p-3 bg-slate-900 rounded-lg text-slate-200 font-mono text-xs overflow-x-auto">
                    <pre className="leading-relaxed">{gitCommands}</pre>
                  </div>
                </div>
              </div>

              {/* Botón cerrar */}
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowGithubModal(false)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
