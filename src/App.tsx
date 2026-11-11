/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { AcademicMention, FinancialVariable, PreconditionerType, ScenarioDefinition } from './types/financial';
import { INITIAL_SCENARIOS_DATA } from './data/scenarios';
import {
  computeComponentErrors,
  norm2,
  solveCholesky,
  solvePCG,
  validateMatrix,
} from './utils/matrixMath';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CaseStudySection } from './components/CaseStudySection';
import { FormulationSection } from './components/FormulationSection';
import { DataInputSection } from './components/DataInputSection';
import { ReferenceSolutionSection } from './components/ReferenceSolutionSection';
import { GcpVsGcSection } from './components/GcpVsGcSection';
import { ErrorAnalysisSection } from './components/ErrorAnalysisSection';
import { ComparativeTableSection } from './components/ComparativeTableSection';
import { QaModuleSection } from './components/QaModuleSection';
import { ConclusionsSection } from './components/ConclusionsSection';

export default function App() {
  const [selectedMention, setSelectedMention] = useState<AcademicMention>('ia_ciencia_datos');
  
  // All registered scenarios (initial + user added custom cases)
  const [scenarios, setScenarios] = useState<Record<string, ScenarioDefinition>>(() => ({
    ...INITIAL_SCENARIOS_DATA,
  }));
  
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('ideal');

  // Matrix and Vector state initialized from Ideal scenario
  const defaultScenario = INITIAL_SCENARIOS_DATA.ideal;
  const [A, setA] = useState<number[][]>(() => defaultScenario.A.map(r => [...r]));
  const [b, setB] = useState<number[]>(() => [...defaultScenario.b]);
  const [x0, setX0] = useState<number[]>(() => new Array(defaultScenario.A.length).fill(0));
  const [tolerance, setTolerance] = useState<number>(1e-6);
  const [preconditioner, setPreconditioner] = useState<PreconditionerType>('jacobi');
  const [variables, setVariables] = useState<FinancialVariable[]>(() => defaultScenario.variables);

  // Scenario Selection Handler
  const handleSelectScenario = useCallback((id: string) => {
    const sc = scenarios[id] || INITIAL_SCENARIOS_DATA[id];
    if (!sc) return;
    setCurrentScenarioId(id);
    setA(sc.A.map(r => [...r]));
    setB([...sc.b]);
    setX0(new Array(sc.A.length).fill(0));
    setPreconditioner(sc.defaultPreconditioner || 'jacobi');
    setVariables(sc.variables);
  }, [scenarios]);

  // Handler for adding a new financial case
  const handleAddNewScenario = useCallback((newScenario: ScenarioDefinition) => {
    setScenarios(prev => ({
      ...prev,
      [newScenario.id]: newScenario,
    }));
    setCurrentScenarioId(newScenario.id);
    setA(newScenario.A.map(r => [...r]));
    setB([...newScenario.b]);
    setX0(new Array(newScenario.A.length).fill(0));
    setPreconditioner(newScenario.defaultPreconditioner || 'jacobi');
    setVariables(newScenario.variables);
  }, []);

  // When changing academic mention, load corresponding suggested case
  const handleSelectMention = useCallback((m: AcademicMention) => {
    setSelectedMention(m);
    if (m === 'ia_ciencia_datos') {
      handleSelectScenario('ideal');
    } else if (m === 'ingenieria_sistemas' && scenarios['sistemas_recursos']) {
      handleSelectScenario('sistemas_recursos');
    } else if (m === 'desarrollo_sistemas' && scenarios['desarrollo_presupuesto']) {
      handleSelectScenario('desarrollo_presupuesto');
    }
  }, [handleSelectScenario, scenarios]);

  // Dynamic Variable / Equation addition (n + 1)
  const handleAddVariable = useCallback(() => {
    const currentN = A.length;
    const newN = currentN + 1;

    // Create new (n+1) x (n+1) matrix preserving symmetry and positive definiteness
    const newA: number[][] = Array.from({ length: newN }, () => new Array(newN).fill(0));
    for (let i = 0; i < newN; i++) {
      for (let j = 0; j < newN; j++) {
        if (i < currentN && j < currentN) {
          newA[i][j] = A[i][j];
        } else if (i === j) {
          // Strong diagonal for positive definiteness
          newA[i][j] = 16.0 + newN * 2.0;
        } else {
          // Small symmetric off-diagonal
          newA[i][j] = 1.5;
        }
      }
    }

    const newB = [...b, 25.0 + newN * 5.0];
    const newX0 = [...x0, 0];

    const newVar: FinancialVariable = {
      id: `var_${newN}`,
      symbol: `x_${newN}`,
      name: `Activo / Partida ${newN}`,
      unit: 'M$ (Millones USD)',
      description: `Magnitud financiera adicional ${newN} incorporada dinámicamente al sistema.`,
    };

    setA(newA);
    setB(newB);
    setX0(newX0);
    setVariables(prev => [...prev, newVar]);
  }, [A, b, x0]);

  // Dynamic Variable / Equation removal (n - 1)
  const handleRemoveVariable = useCallback(() => {
    const currentN = A.length;
    if (currentN <= 4) return; // Strict minimum n >= 4

    const newN = currentN - 1;
    const newA: number[][] = [];
    for (let i = 0; i < newN; i++) {
      newA.push(A[i].slice(0, newN));
    }

    setA(newA);
    setB(b.slice(0, newN));
    setX0(x0.slice(0, newN));
    setVariables(prev => prev.slice(0, newN));
  }, [A, b, x0]);

  // Reset to default scenario values
  const handleResetScenario = useCallback(() => {
    handleSelectScenario(currentScenarioId);
  }, [currentScenarioId, handleSelectScenario]);

  const handleResetToDefault = useCallback(() => {
    handleSelectScenario('ideal');
    setTolerance(1e-6);
  }, [handleSelectScenario]);

  // QA test anomalous matrices
  const handleLoadAsymmetricMatrix = useCallback(() => {
    const newA = A.map(r => [...r]);
    newA[0][1] = 99.0;
    newA[1][0] = 2.0;
    setA(newA);
  }, [A]);

  const handleLoadIndefiniteMatrix = useCallback(() => {
    const newA = A.map(r => [...r]);
    newA[0][0] = -15.0; // Negative diagonal leads to non-positive definiteness
    setA(newA);
  }, [A]);

  // Reactive Computations
  const matrixValidation = useMemo(() => {
    return validateMatrix(A);
  }, [A]);

  const choleskyResult = useMemo(() => {
    if (!matrixValidation.isValid) {
      return {
        success: false,
        L: [],
        y: [],
        x: [],
        errorMessage: matrixValidation.errorMessage || 'Matriz no válida para Cholesky.',
      };
    }
    return solveCholesky(A, b);
  }, [A, b, matrixValidation]);

  const pcgResult = useMemo(() => {
    return solvePCG(A, b, x0, tolerance, 100, preconditioner);
  }, [A, b, x0, tolerance, preconditioner]);

  const cgResult = useMemo(() => {
    return solvePCG(A, b, x0, tolerance, 100, 'none');
  }, [A, b, x0, tolerance]);

  const componentErrors = useMemo(() => {
    if (!choleskyResult.success) {
      return [];
    }
    return computeComponentErrors(choleskyResult.x, pcgResult.x, variables);
  }, [choleskyResult, pcgResult.x, variables]);

  const bNorm = useMemo(() => norm2(b), [b]);

  // Export Report to structured JSON file
  const handleExportReport = useCallback(() => {
    const reportData = {
      project: 'Desafío Académico de Métodos Numéricos - UMSA',
      institution: 'Universidad Mayor de San Andrés - Facultad de Ciencias Puras y Naturales - Informática',
      paperReference: 'Suñagua S., Porfirio (2020). Método de Gradientes Conjugados Precondicionado. Revista Boliviana de Matemática, 04, 2–7.',
      timestamp: new Date().toISOString(),
      academicMention: selectedMention,
      activeScenario: currentScenarioId,
      parameters: {
        tolerance,
        dimension: A.length,
        x0,
        preconditioner,
      },
      matrixA: A,
      vectorB: b,
      validation: {
        isSquare: matrixValidation.isSquare,
        isSymmetric: matrixValidation.isSymmetric,
        isPositiveDefinite: matrixValidation.isPositiveDefinite,
        sylvesterMinors: matrixValidation.sylvesterMinors,
        eigenvalues: matrixValidation.eigenvalues,
        conditionNumberA: pcgResult.conditionNumberOriginal,
        conditionNumberPreconditioned: pcgResult.conditionNumberPreconditioned,
      },
      directReferenceSolution: {
        method: 'Cholesky Factorization A = LL^T',
        success: choleskyResult.success,
        x_ref: choleskyResult.x,
        L: choleskyResult.L,
        y: choleskyResult.y,
      },
      iterativeSolutionPCG: {
        algorithm: 'Suñagua (2020) Preconditioned Conjugate Gradient',
        converged: pcgResult.converged,
        iterations: pcgResult.iterations,
        x_gcp: pcgResult.x,
        finalResidualNorm: pcgResult.finalResidualNorm,
        finalRelativeResidual: pcgResult.finalRelativeResidual,
        iterationHistory: pcgResult.history,
      },
      contrastCGSimple: {
        iterations: cgResult.iterations,
        finalRelativeResidual: cgResult.finalRelativeResidual,
      },
      errorAnalysis: componentErrors,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UMSA_GCP_Reporte_Financiero_${currentScenarioId}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [
    selectedMention,
    currentScenarioId,
    tolerance,
    A,
    b,
    x0,
    preconditioner,
    matrixValidation,
    pcgResult,
    cgResult,
    choleskyResult,
    componentErrors,
  ]);

  const handlePrintReport = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        onExportReport={handleExportReport}
        onResetToDefault={handleResetToDefault}
      />

      <main className="flex-1">
        {/* Module 1: Inicio */}
        <HeroSection
          selectedMention={selectedMention}
          onSelectMention={handleSelectMention}
        />

        {/* Module 2: Caso de Estudio */}
        <CaseStudySection
          selectedMention={selectedMention}
        />

        {/* Module 3: Formulación */}
        <FormulationSection
          A={A}
          b={b}
          variables={variables}
          validation={matrixValidation}
        />

        {/* Module 4 & 5: Entrada de Datos, Gestión de Casos y Tres Escenarios */}
        <DataInputSection
          scenarios={scenarios}
          currentScenarioId={currentScenarioId}
          onSelectScenario={handleSelectScenario}
          onAddNewScenario={handleAddNewScenario}
          onAddVariable={handleAddVariable}
          onRemoveVariable={handleRemoveVariable}
          A={A}
          b={b}
          x0={x0}
          variables={variables}
          tolerance={tolerance}
          preconditioner={preconditioner}
          onChangeA={setA}
          onChangeB={setB}
          onChangeX0={setX0}
          onChangeTolerance={setTolerance}
          onChangePreconditioner={setPreconditioner}
          onResetScenario={handleResetScenario}
        />

        {/* Module 6: Solución Numérica de Referencia (Método Directo Cholesky) */}
        <ReferenceSolutionSection
          cholesky={choleskyResult}
          variables={variables}
          b={b}
        />

        {/* Module 7: GCP vs GC (Algoritmo Suñagua 2020) */}
        <GcpVsGcSection
          pcgResult={pcgResult}
          cgResult={cgResult}
          tolerance={tolerance}
          variables={variables}
        />

        {/* Module 8: Análisis de Errores y Condicionamiento */}
        <ErrorAnalysisSection
          errors={componentErrors}
          pcgResult={pcgResult}
          cgResult={cgResult}
          bNorm={bNorm}
        />

        {/* Module 8 Obligatorio: Tabla Comparativa de los 3 Escenarios */}
        <ComparativeTableSection />

        {/* Module 9: Módulo de Pruebas de Software QA */}
        <QaModuleSection
          onLoadAsymmetricMatrix={handleLoadAsymmetricMatrix}
          onLoadIndefiniteMatrix={handleLoadIndefiniteMatrix}
        />

        {/* Module 10: Conclusiones y Referencias */}
        <ConclusionsSection
          onExportReport={handleExportReport}
          onPrintReport={handlePrintReport}
        />
      </main>
    </div>
  );
}
