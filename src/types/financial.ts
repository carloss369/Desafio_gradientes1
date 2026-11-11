export type PreconditionerType = 'jacobi' | 'ssor' | 'none';

export type AcademicMention = 
  | 'ia_ciencia_datos' 
  | 'ingenieria_sistemas' 
  | 'desarrollo_sistemas';

export interface FinancialVariable {
  id: string;
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  badge: string;
  description: string;
  financialContext: string;
  A: number[][];
  b: number[];
  variables: FinancialVariable[];
  defaultPreconditioner: PreconditionerType;
  expectedConditionRatio: string;
  category?: 'obligatorio' | 'mencion' | 'personalizado';
}

export interface MatrixValidationResult {
  isValid: boolean;
  isSquare: boolean;
  isSymmetric: boolean;
  isPositiveDefinite: boolean;
  sylvesterMinors: number[];
  eigenvalues: number[];
  errorMessage?: string;
  warningMessage?: string;
}

export interface CholeskyResult {
  success: boolean;
  L: number[][];
  y: number[]; // Ly = b
  x: number[]; // L^T x = y
  errorMessage?: string;
}

export interface IterationStep {
  k: number;
  xk: number[];
  rk: number[];
  zk?: number[];
  pk: number[];
  residualNorm: number;
  relativeResidual: number;
  alpha?: number;
  beta?: number;
}

export interface SolverResult {
  converged: boolean;
  iterations: number;
  x: number[];
  finalResidualNorm: number;
  finalRelativeResidual: number;
  history: IterationStep[];
  conditionNumberOriginal: number;
  conditionNumberPreconditioned: number;
  preconditionerName: string;
  executionTimeMs: number;
}

export interface ComponentError {
  index: number;
  variableName: string;
  symbol: string;
  xref: number;
  xgcp: number;
  ea: number; // Absolute error
  er: number | null; // Relative error (null if xref == 0)
  ep: number | null; // Percentage error
  unit: string;
}

export interface QaTestCase {
  id: string;
  name: string;
  category: string;
  inputDescription: string;
  expectedResult: string;
  obtainedResult: string;
  passed: boolean;
  details: string;
  timestamp?: string;
}
