import {
  CholeskyResult,
  ComponentError,
  FinancialVariable,
  IterationStep,
  MatrixValidationResult,
  PreconditionerType,
  SolverResult,
} from '../types/financial';

// Vector utilities
export function dot(u: number[], v: number[]): number {
  let sum = 0;
  for (let i = 0; i < u.length; i++) {
    sum += u[i] * v[i];
  }
  return sum;
}

export function norm2(u: number[]): number {
  return Math.sqrt(dot(u, u));
}

export function vectorAdd(u: number[], v: number[], scalar = 1): number[] {
  return u.map((val, i) => val + scalar * v[i]);
}

export function vectorSub(u: number[], v: number[]): number[] {
  return u.map((val, i) => val - v[i]);
}

export function matrixVectorMult(A: number[][], x: number[]): number[] {
  const n = A.length;
  const result = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += A[i][j] * x[j];
    }
    result[i] = sum;
  }
  return result;
}

export function matrixMult(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const m = B[0].length;
  const kLen = B.length;
  const C: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let k = 0; k < kLen; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

export function getLeadingSubmatrix(A: number[][], k: number): number[][] {
  const sub: number[][] = [];
  for (let i = 0; i < k; i++) {
    sub.push(A[i].slice(0, k));
  }
  return sub;
}

export function determinant(matrix: number[][]): number {
  const n = matrix.length;
  // Clone matrix for Gaussian elimination
  const A = matrix.map(row => [...row]);
  let det = 1;

  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(A[maxRow][i]) < 1e-13) {
      return 0;
    }

    if (maxRow !== i) {
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      det = -det;
    }

    det *= A[i][i];

    for (let k = i + 1; k < n; k++) {
      const factor = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j];
      }
    }
  }

  return det;
}

// Compute eigenvalues of a real symmetric matrix via Jacobi eigenvalue method
export function computeEigenvaluesSymmetric(matrix: number[][], maxIter = 100): number[] {
  const n = matrix.length;
  const A = matrix.map(row => [...row]);

  for (let iter = 0; iter < maxIter; iter++) {
    // Find largest off-diagonal element in absolute value
    let p = 0;
    let q = 1;
    let maxOff = 0;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const val = Math.abs(A[i][j]);
        if (val > maxOff) {
          maxOff = val;
          p = i;
          q = j;
        }
      }
    }

    if (maxOff < 1e-12) {
      break;
    }

    // Jacobi rotation angle
    const app = A[p][p];
    const aqq = A[q][q];
    const apq = A[p][q];

    const phi = 0.5 * Math.atan2(2 * apq, aqq - app);
    const c = Math.cos(phi);
    const s = Math.sin(phi);

    // Update matrix A = J^T A J
    for (let i = 0; i < n; i++) {
      if (i !== p && i !== q) {
        const aip = A[i][p];
        const aiq = A[i][q];
        A[i][p] = c * aip - s * aiq;
        A[p][i] = A[i][p];
        A[i][q] = s * aip + c * aiq;
        A[q][i] = A[i][q];
      }
    }

    A[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
    A[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
    A[p][q] = 0;
    A[q][p] = 0;
  }

  const eigenvalues = [];
  for (let i = 0; i < n; i++) {
    eigenvalues.push(A[i][i]);
  }
  return eigenvalues.sort((a, b) => a - b);
}

// Matrix Inverse via Gauss-Jordan elimination
export function matrixInverse(matrix: number[][]): number[][] | null {
  const n = matrix.length;
  // Augment A with identity
  const aug: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array(2 * n).fill(0);
    for (let j = 0; j < n; j++) {
      row[j] = matrix[i][j];
    }
    row[n + i] = 1;
    aug.push(row);
  }

  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
        maxRow = k;
      }
    }

    if (Math.abs(aug[maxRow][i]) < 1e-12) {
      return null; // Singular matrix
    }

    if (maxRow !== i) {
      [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
    }

    const pivot = aug[i][i];
    for (let j = 0; j < 2 * n; j++) {
      aug[i][j] /= pivot;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const factor = aug[k][i];
        for (let j = 0; j < 2 * n; j++) {
          aug[k][j] -= factor * aug[i][j];
        }
      }
    }
  }

  const inv: number[][] = [];
  for (let i = 0; i < n; i++) {
    inv.push(aug[i].slice(n, 2 * n));
  }
  return inv;
}

// Condition number of a square matrix
export function computeConditionNumber(A: number[][]): number {
  const eigenvalues = computeEigenvaluesSymmetric(A);
  const minEig = eigenvalues[0];
  const maxEig = eigenvalues[eigenvalues.length - 1];
  if (minEig <= 0) {
    return Infinity;
  }
  return maxEig / minEig;
}

// Validation function for Matrix A
export function validateMatrix(A: number[][]): MatrixValidationResult {
  const n = A.length;
  if (n < 4) {
    return {
      isValid: false,
      isSquare: false,
      isSymmetric: false,
      isPositiveDefinite: false,
      sylvesterMinors: [],
      eigenvalues: [],
      errorMessage: `El sistema debe poseer al menos 4 ecuaciones e incógnitas (n ≥ 4). Actualmente tiene dimensión ${n}.`,
    };
  }

  // Check square
  for (let i = 0; i < n; i++) {
    if (!A[i] || A[i].length !== n) {
      return {
        isValid: false,
        isSquare: false,
        isSymmetric: false,
        isPositiveDefinite: false,
        sylvesterMinors: [],
        eigenvalues: [],
        errorMessage: 'La matriz A no es cuadrada (las filas tienen longitudes desiguales).',
      };
    }
  }

  // Check symmetry
  let isSymmetric = true;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(A[i][j] - A[j][i]) > 1e-7) {
        isSymmetric = false;
        break;
      }
    }
    if (!isSymmetric) break;
  }

  // Sylvester's Criterion (Leading principal minors det(A_k) > 0 for k = 1..n)
  const sylvesterMinors: number[] = [];
  let isPositiveDefiniteSylvester = true;

  for (let k = 1; k <= n; k++) {
    const sub = getLeadingSubmatrix(A, k);
    const detK = determinant(sub);
    sylvesterMinors.push(detK);
    if (detK <= 1e-12) {
      isPositiveDefiniteSylvester = false;
    }
  }

  // Eigenvalues
  let eigenvalues: number[] = [];
  let isPositiveDefiniteEigen = true;
  if (isSymmetric) {
    eigenvalues = computeEigenvaluesSymmetric(A);
    isPositiveDefiniteEigen = eigenvalues.every(ev => ev > 1e-10);
  }

  const isPositiveDefinite = isPositiveDefiniteSylvester && isPositiveDefiniteEigen;

  if (!isSymmetric) {
    return {
      isValid: false,
      isSquare: true,
      isSymmetric: false,
      isPositiveDefinite: false,
      sylvesterMinors,
      eigenvalues,
      errorMessage: 'La matriz A NO es simétrica (A ≠ Aᵀ). El método de Gradientes Conjugados requiere estrictamente una matriz simétrica.',
    };
  }

  if (!isPositiveDefinite) {
    return {
      isValid: false,
      isSquare: true,
      isSymmetric: true,
      isPositiveDefinite: false,
      sylvesterMinors,
      eigenvalues,
      errorMessage: 'La matriz A NO es definida positiva (falla el Criterio de Sylvester o existen autovalores λ ≤ 0). El método de Gradientes Conjugados requiere xᵀAx > 0 para todo x ≠ 0.',
    };
  }

  return {
    isValid: true,
    isSquare: true,
    isSymmetric: true,
    isPositiveDefinite: true,
    sylvesterMinors,
    eigenvalues,
  };
}

// Cholesky Factorization A = L L^T (Direct Reference Method)
export function solveCholesky(A: number[][], b: number[]): CholeskyResult {
  const n = A.length;
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let j = 0; j < n; j++) {
    let d = 0;
    for (let k = 0; k < j; k++) {
      d += L[j][k] * L[j][k];
    }
    const val = A[j][j] - d;
    if (val <= 1e-12) {
      return {
        success: false,
        L: [],
        y: [],
        x: [],
        errorMessage: `Fallo en factorización de Cholesky: pivote no positivo en fila ${j + 1} (valor ${val.toFixed(6)}). La matriz no es definida positiva.`,
      };
    }
    L[j][j] = Math.sqrt(val);

    for (let i = j + 1; i < n; i++) {
      let s = 0;
      for (let k = 0; k < j; k++) {
        s += L[i][k] * L[j][k];
      }
      L[i][j] = (A[i][j] - s) / L[j][j];
    }
  }

  // Forward substitution L y = b
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let k = 0; k < i; k++) {
      s += L[i][k] * y[k];
    }
    y[i] = (b[i] - s) / L[i][i];
  }

  // Back substitution L^T x = y
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = 0;
    for (let k = i + 1; k < n; k++) {
      s += L[k][i] * x[k]; // Note: L^T[i][k] = L[k][i]
    }
    x[i] = (y[i] - s) / L[i][i];
  }

  return {
    success: true,
    L,
    y,
    x,
  };
}

// Preconditioner Solver: M z = r
export function solvePreconditioner(
  type: PreconditionerType,
  A: number[][],
  r: number[]
): number[] {
  const n = A.length;
  if (type === 'none') {
    return [...r];
  }

  if (type === 'jacobi') {
    // Jacobi (diagonal): M = diag(A) -> z_i = r_i / A_ii
    const z = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      const diag = A[i][i];
      z[i] = Math.abs(diag) > 1e-14 ? r[i] / diag : r[i];
    }
    return z;
  }

  if (type === 'ssor') {
    // SSOR with omega = 1.0 (Symmetric Gauss-Seidel)
    // M = (D + L) D^-1 (D + L^T)
    // Step 1: (D + L) y = r (Forward solve)
    const y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += A[i][j] * y[j];
      }
      y[i] = (r[i] - sum) / A[i][i];
    }

    // Step 2: v = D y
    const v = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      v[i] = A[i][i] * y[i];
    }

    // Step 3: (D + L^T) z = v (Backward solve)
    const z = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += A[i][j] * z[j]; // since A is symmetric, A_ij = (L^T)_ij
      }
      z[i] = (v[i] - sum) / A[i][i];
    }
    return z;
  }

  return [...r];
}

// Compute condition number of preconditioned matrix M^{-1} A
export function computePreconditionedConditionNumber(
  A: number[][],
  type: PreconditionerType
): number {
  if (type === 'none') {
    return computeConditionNumber(A);
  }

  const n = A.length;
  // Construct explicit M^{-1}
  let Minv: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  if (type === 'jacobi') {
    for (let i = 0; i < n; i++) {
      Minv[i][i] = 1 / A[i][i];
    }
  } else if (type === 'ssor') {
    // Solve M column by column for identity columns
    for (let j = 0; j < n; j++) {
      const ej = new Array(n).fill(0);
      ej[j] = 1;
      const col = solvePreconditioner('ssor', A, ej);
      for (let i = 0; i < n; i++) {
        Minv[i][j] = col[i];
      }
    }
  }

  // Preconditioned matrix C = Minv * A
  const C = matrixMult(Minv, A);

  // For a symmetric positive definite preconditioning, eigenvalues of M^{-1}A are all real and positive
  // Compute eigenvalues of the symmetrized operator M^{-1/2} A M^{-1/2} if Jacobi,
  // or via QR/power estimation.
  if (type === 'jacobi') {
    // Symmetrized version: S_ij = A_ij / sqrt(A_ii * A_jj)
    const S: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        S[i][j] = A[i][j] / Math.sqrt(A[i][i] * A[j][j]);
      }
    }
    const eigs = computeEigenvaluesSymmetric(S);
    const minEig = eigs[0];
    const maxEig = eigs[eigs.length - 1];
    return minEig > 0 ? maxEig / minEig : Infinity;
  }

  // For general SSOR, compute condition number using singular values or estimate via power iteration on C
  // Since C is similar to symmetric positive definite matrix, its eigenvalues are real and positive
  const Cinv = matrixInverse(C);
  if (!Cinv) return Infinity;

  // 1-norm or Frobenius norm estimation
  let normC = 0;
  let normCinv = 0;
  for (let j = 0; j < n; j++) {
    let colSumC = 0;
    let colSumCinv = 0;
    for (let i = 0; i < n; i++) {
      colSumC += Math.abs(C[i][j]);
      colSumCinv += Math.abs(Cinv[i][j]);
    }
    normC = Math.max(normC, colSumC);
    normCinv = Math.max(normCinv, colSumCinv);
  }

  return normC * normCinv;
}

// Algoritmo de Suñagua S., P. (2020)
// Método de Gradientes Conjugados Precondicionado
export function solvePCG(
  A: number[][],
  b: number[],
  x0: number[],
  tolerance = 1e-6,
  maxIterations = 100,
  preconditioner: PreconditionerType = 'jacobi'
): SolverResult {
  const startTime = performance.now();
  const n = A.length;
  let x = [...x0];
  
  // r0 = b - A * x0
  let r = vectorSub(b, matrixVectorMult(A, x));
  
  const bNorm = norm2(b);
  const normBase = bNorm > 1e-14 ? bNorm : 1.0;
  let rNorm = norm2(r);
  let relRes = rNorm / normBase;

  const history: IterationStep[] = [];

  // Initial step 0
  let z = solvePreconditioner(preconditioner, A, r);
  let p = [...z];

  history.push({
    k: 0,
    xk: [...x],
    rk: [...r],
    zk: [...z],
    pk: [...p],
    residualNorm: rNorm,
    relativeResidual: relRes,
  });

  if (relRes < tolerance) {
    const elapsed = performance.now() - startTime;
    return {
      converged: true,
      iterations: 0,
      x,
      finalResidualNorm: rNorm,
      finalRelativeResidual: relRes,
      history,
      conditionNumberOriginal: computeConditionNumber(A),
      conditionNumberPreconditioned: computePreconditionedConditionNumber(A, preconditioner),
      preconditionerName: preconditioner,
      executionTimeMs: elapsed,
    };
  }

  let converged = false;
  let rzPrev = dot(r, z);

  for (let k = 0; k < maxIterations; k++) {
    const Ap = matrixVectorMult(A, p);
    const pAp = dot(p, Ap);

    if (Math.abs(pAp) < 1e-16) {
      break;
    }

    const alpha = rzPrev / pAp;

    // x_{k+1} = x_k + alpha * p_k
    x = vectorAdd(x, p, alpha);

    // r_{k+1} = r_k - alpha * A * p_k
    r = vectorAdd(r, Ap, -alpha);

    rNorm = norm2(r);
    relRes = rNorm / normBase;

    if (relRes < tolerance) {
      converged = true;
      history.push({
        k: k + 1,
        xk: [...x],
        rk: [...r],
        pk: [...p],
        residualNorm: rNorm,
        relativeResidual: relRes,
        alpha,
      });
      break;
    }

    // Solve M z_{k+1} = r_{k+1}
    z = solvePreconditioner(preconditioner, A, r);
    const rzNext = dot(r, z);

    if (Math.abs(rzPrev) < 1e-18) {
      break;
    }

    const beta = rzNext / rzPrev;

    // p_{k+1} = z_{k+1} + beta * p_k
    p = vectorAdd(z, p, beta);

    rzPrev = rzNext;

    history.push({
      k: k + 1,
      xk: [...x],
      rk: [...r],
      zk: [...z],
      pk: [...p],
      residualNorm: rNorm,
      relativeResidual: relRes,
      alpha,
      beta,
    });
  }

  const elapsed = performance.now() - startTime;
  return {
    converged,
    iterations: history.length - 1,
    x,
    finalResidualNorm: rNorm,
    finalRelativeResidual: relRes,
    history,
    conditionNumberOriginal: computeConditionNumber(A),
    conditionNumberPreconditioned: computePreconditionedConditionNumber(A, preconditioner),
    preconditionerName: preconditioner,
    executionTimeMs: elapsed,
  };
}

// Compute component-wise errors between reference and GCP solution
export function computeComponentErrors(
  xref: number[],
  xgcp: number[],
  variables: FinancialVariable[]
): ComponentError[] {
  return xref.map((refVal, i) => {
    const gcpVal = xgcp[i] ?? 0;
    const ea = Math.abs(refVal - gcpVal);
    const er = Math.abs(refVal) > 1e-12 ? ea / Math.abs(refVal) : null;
    const ep = er !== null ? er * 100 : null;

    const v = variables[i] || {
      id: `x${i + 1}`,
      symbol: `x_${i + 1}`,
      name: `Variable ${i + 1}`,
      unit: 'unidades',
    };

    return {
      index: i,
      variableName: v.name,
      symbol: v.symbol,
      xref: refVal,
      xgcp: gcpVal,
      ea,
      er,
      ep,
      unit: v.unit,
    };
  });
}
