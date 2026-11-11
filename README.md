# Universidad Mayor de San Andrés (UMSA)
## Facultad de Ciencias Puras y Naturales · Carrera de Informática
### Desafío Académico de Métodos Numéricos

# Aplicación del Método de Gradientes Conjugados Precondicionado en Problemas Financieros

* **Modalidad:** INDIVIDUAL
* **Área:** Finanzas y Optimización Cuadrática
* **Dimensión del Sistema:** $n \ge 4$ ecuaciones e incógnitas
* **Criterio de Parada:** $\|r_k\|_2 / \|b\|_2 < 10^{-6}$
* **Fundamento Científico:** Suñagua S., Porfirio (2020). *Método de Gradientes Conjugados Precondicionado*. Revista Boliviana de Matemática – UMSA, Vol. 04, pp. 2–7.
* **Menciones Académicas Cubiertas:**
  1. Inteligencia Artificial y Ciencia de Datos
  2. Ingeniería de Sistemas
  3. Desarrollo de Sistemas

---

## 1. Descripción del Proyecto

Esta plataforma interactiva traslada los fundamentos teóricos y algorítmicos del artículo científico de Suñagua (2020) a la modelación y resolución numérica de sistemas lineales simétricos definidos positivos $Ax = b$ provenientes del ámbito financiero.

El caso de estudio central modela la **Optimización de Cartera de Inversiones con Regularización Cuadrática de Riesgo (Markowitz / Tikhonov)** y asignación presupuestaria interdepartamental, evaluando el comportamiento numérico, la velocidad de convergencia y la reducción del número de condición a través de tres escenarios:
1. **Escenario 1 (Ideal):** Mercado financiero en equilibrio, baja covarianza cruzada y condición baja ($\kappa(A) \approx 3.8$).
2. **Escenario 2 (Bajo Estrés Financiero):** Shock macroeconómico e inflación, contagio inter-activos ($\kappa(A) \approx 18.5$) y desplazamiento del punto de equilibrio financiero.
3. **Escenario 3 (Mal Condicionado):** Gran disparidad en órdenes de magnitud entre activos (mal escalamiento diagonal, varianza de 1,450 vs 1.2), elevando $\kappa(A) \approx 2,840$. Se demuestra cómo el Precondicionador de Jacobi reduce el número de condición a $\kappa(M^{-1}A) \approx 6.1$ (reducción del 99.7%) y acelera la convergencia.

---

## 2. Arquitectura de Software

El proyecto está construido bajo una arquitectura modular y reactiva con TypeScript y React:

```
├── index.html                   # Entry point con metadatos SEO y tipografías (Plus Jakarta Sans, JetBrains Mono)
├── metadata.json                # Configuración de AI Studio
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración estricta de TypeScript
├── vite.config.ts               # Bundler Vite con Tailwind CSS
├── src/
│   ├── main.tsx                 # Montaje de la aplicación React
│   ├── App.tsx                  # Componente orquestador y gestión reactiva de estado
│   ├── index.css                # Directivas de Tailwind CSS v4
│   ├── types/
│   │   └── financial.ts         # Tipos: Matrix, Vector, IterationStep, ScenarioDefinition, QaTestCase
│   ├── utils/
│   │   └── matrixMath.ts        # Motor matemático puro: Cholesky, Sylvester, Jacobi Eig, PCG Suñagua, SSOR, errores
│   ├── data/
│   │   └── scenarios.ts         # Definiciones de los 3 escenarios obligatorios, casos de menciones y n=5, n=6
│   └── components/
│       ├── Header.tsx           # Barra de navegación (Top Bar Contract) y exportación
│       ├── HeroSection.tsx      # Sección 1: Inicio, datos institucionales UMSA y selector de mención
│       ├── CaseStudySection.tsx # Sección 2: Marco conceptual, justificación financiera y datos
│       ├── FormulationSection.tsx # Sección 3: Variables, matriz Ax=b, Criterio de Sylvester en vivo
│       ├── DataInputSection.tsx # Secciones 4 y 5: Editor dinámico, carga de casos y agregado de variables
│       ├── ReferenceSolutionSection.tsx # Sección 6: Método directo exacto (Cholesky A = LLᵀ)
│       ├── GcpVsGcSection.tsx   # Sección 7: Algoritmo de Suñagua, gráfico SVG logarítmico y tabla iterativa
│       ├── ErrorAnalysisSection.tsx # Sección 8: Errores Ea, Er, Ep por variable y reducción de κ
│       ├── ComparativeTableSection.tsx # Sección 8: Tabla comparativa obligatoria de 11 filas
│       ├── QaModuleSection.tsx  # Sección 9: Módulo QA con 4 pruebas obligatorias ejecutables
│       └── ConclusionsSection.tsx # Sección 10: Conclusiones, bibliografía formal y descargas
```

---

## 3. Fundamentos Matemáticos y Algoritmos

### 3.1. Formulación del Sistema
El problema de optimización cuadrática:
$$\min_{x} f(x) = \frac{1}{2} x^T A x - b^T x$$
conduce al sistema lineal:
$$A x = b$$
donde:
* $A = \Sigma + \gamma I$ es la matriz de covarianzas inter-activos regularizada por aversión al riesgo $\gamma > 0$, garantizando **simetría** ($A = A^T$) y **definición positiva** ($x^T A x > 0, \forall x \neq 0$).
* $b$ representa el vector de retornos requeridos o demanda mínima de liquidez.

### 3.2. Criterio de Sylvester
Se calculan en tiempo real todos los menores principales líderes:
$$\det(A_k) > 0, \quad \forall k \in \{1, \dots, n\}$$
lo que confirma analíticamente la definición positiva de la matriz.

### 3.3. Solución Numérica de Referencia (Método Directo Cholesky)
$$A = L L^T$$
1. **Sustitución progresiva:** $L y = b$
2. **Sustitución regresiva:** $L^T x_{\text{ref}} = y$

### 3.4. Algoritmo de Gradientes Conjugados Precondicionado (Suñagua, 2020)
Dado $x_0 = \mathbf{0}$, calcular $r_0 = b - A x_0$, resolver $M z_0 = r_0$, fijar $p_0 = z_0$. Para $k = 0, 1, \dots$:
$$\alpha_k = \frac{r_k^T z_k}{p_k^T A p_k}$$
$$x_{k+1} = x_k + \alpha_k p_k$$
$$r_{k+1} = r_k - \alpha_k A p_k$$
Criterio de convergencia: $\frac{\|r_{k+1}\|_2}{\|b\|_2} < 10^{-6}$. Si se cumple, terminar.
Resolver $M z_{k+1} = r_{k+1}$
$$\beta_k = \frac{r_{k+1}^T z_{k+1}}{r_k^T z_k}$$
$$p_{k+1} = z_{k+1} + \beta_k p_k$$

---

## 4. Requisitos y Ejecución Local

### Prerrequisitos
* Node.js v18.0 o superior (recomendado v20+)
* npm v9.0 o superior

### Instalación de Dependencias
```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_DIRECTORIO>

# Instalar dependencias
npm install
```

### Ejecución en Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible de forma interactiva en `http://localhost:3000`.

### Verificación y Compilación
```bash
# Verificación de sintaxis y tipado TypeScript
npm run lint

# Compilación para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 5. Módulo de Pruebas de Software (QA)

La aplicación incluye un banco de pruebas de aseguramiento de calidad con validación interactiva:
1. **QA-01 (Carga de Escenarios):** Verifica la resolución y convergencia con residuo $< 10^{-6}$ en los escenarios Ideal, Estrés y Mal Condicionado.
2. **QA-02 (Validación de Matriz No Válida):** Inyecta deliberadamente matrices no simétricas o con determinante de Sylvester $\le 0$, comprobando que el sistema captura la excepción formalmente sin colapsar.
3. **QA-03 (Edición Dinámica):** Modifica coeficientes de $A$ y $b$ verificando la reactividad inmediata de Cholesky, GCP y errores.
4. **QA-04 (Comparativa de Precondicionamiento):** Demuestra que en el escenario mal condicionado $\text{Iter}(GCP) \le \text{Iter}(GC)$ y $\kappa(M^{-1}A) < \kappa(A)$.

---

## 6. Bibliografía Principal

1. **Suñagua S., Porfirio (2020).** *Método de Gradientes Conjugados Precondicionado*. Revista Boliviana de Matemática – UMSA, Vol. 04, pp. 2–7. La Paz, Bolivia.
2. **Golub, Gene H., & Van Loan, Charles F. (2013).** *Matrix Computations* (4th ed.). Johns Hopkins University Press.
3. **Saad, Yousef (2003).** *Iterative Methods for Sparse Linear Systems* (2nd ed.). SIAM.

---
**Carrera de Informática · Facultad de Ciencias Puras y Naturales**  
**Universidad Mayor de San Andrés (UMSA) — 2026**
