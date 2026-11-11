import { AcademicMention, FinancialVariable, ScenarioDefinition } from '../types/financial';

export interface MentionInfo {
  id: AcademicMention;
  name: string;
  emphasis: string;
  caseTitle: string;
  caseSummary: string;
  dataOrigin: string;
}

export const ACADEMIC_MENTIONS: Record<AcademicMention, MentionInfo> = {
  ia_ciencia_datos: {
    id: 'ia_ciencia_datos',
    name: 'Inteligencia Artificial y Ciencia de Datos',
    emphasis: 'Preparación y análisis exploratorio de datos; estimación de covarianzas/correlaciones; sensibilidad y minimización de riesgo cuadrático.',
    caseTitle: 'Optimización de Cartera de Inversiones con Regularización Cuadrática de Riesgo (Markowitz)',
    caseSummary: 'Determinación de la asignación óptima de capital en cuatro clases de activos financieros bajo restricciones de rendimiento objetivo y matriz de covarianzas empíricas.',
    dataOrigin: 'Series históricas de rendimientos diarios ajustados de bonos soberanos, índices tecnológicos, commodities y fideicomisos financieros.',
  },
  ingenieria_sistemas: {
    id: 'ingenieria_sistemas',
    name: 'Ingeniería de Sistemas',
    emphasis: 'Modelado de procesos, reglas de negocio, flujo de caja interdepartamental y valor organizacional.',
    caseTitle: 'Distribución Estratégica de Recursos Financieros en Unidades Tecnológicas Corporativas',
    caseSummary: 'Equilibrio de flujos monetarios y sinergias inter-departamentales entre unidades de infraestructura, ciberseguridad, analítica y desarrollo de software.',
    dataOrigin: 'Matrices de insumo-producto y costos operativos corporativos auditados.',
  },
  desarrollo_sistemas: {
    id: 'desarrollo_sistemas',
    name: 'Desarrollo de Sistemas',
    emphasis: 'Arquitectura de software, componentes web, validaciones matemáticas de entrada y pruebas funcionales.',
    caseTitle: 'Simulador de Asignación y Ajustes Presupuestarios en Operaciones Cloud & DevOps',
    caseSummary: 'Balanceo presupuestario en infraestructura escalable: cómputo cloud/GPU, licencias SaaS, talento humano y control de calidad QA.',
    dataOrigin: 'Reportes de costos de infraestructura en nube y métricas de ingeniería de confiabilidad de sitios (SRE).',
  },
};

export const FINANCIAL_VARIABLES_FLAGSHIP: FinancialVariable[] = [
  {
    id: 'x1',
    symbol: 'x_1',
    name: 'Bonos Soberanos del Tesoro',
    unit: 'M$ (Millones USD)',
    description: 'Activo de renta fija de alta calificación crediticia y baja volatilidad; actúa como reserva de liquidez y ancla de estabilidad.',
  },
  {
    id: 'x2',
    symbol: 'x_2',
    name: 'Acciones Tecnológicas & IA',
    unit: 'M$ (Millones USD)',
    description: 'Activo de renta variable con alto potencial de crecimiento compuesto, elevada liquidez diaria y volatilidad intermedia-alta.',
  },
  {
    id: 'x3',
    symbol: 'x_3',
    name: 'Commodities & Reserva de Oro',
    unit: 'M$ (Millones USD)',
    description: 'Instrumento de cobertura ante presiones inflacionarias y depreciación cambiaria, con baja correlación histórica con la renta variable.',
  },
  {
    id: 'x4',
    symbol: 'x_4',
    name: 'Fideicomiso Inmobiliario & Fintech',
    unit: 'M$ (Millones USD)',
    description: 'Vehículo de inversión en bienes raíces comerciales y crédito digital que provee flujos periódicos de dividendos y flujo de caja constante.',
  },
];

export const FINANCIAL_VARIABLES_SISTEMAS: FinancialVariable[] = [
  {
    id: 'u1',
    symbol: 'x_1',
    name: 'Infraestructura Cloud & Data Centers',
    unit: 'k$ (Miles USD)',
    description: 'Unidad de cómputo escalable, servidores dedicados, almacenamiento distribuido y redundancia multisitio.',
  },
  {
    id: 'u2',
    symbol: 'x_2',
    name: 'Ciberseguridad & SOC',
    unit: 'k$ (Miles USD)',
    description: 'Centro de operaciones de seguridad, firewalls de próxima generación, mitigación DDoS y auditoría continua.',
  },
  {
    id: 'u3',
    symbol: 'x_3',
    name: 'Analítica Avanzada & Modelos IA',
    unit: 'k$ (Miles USD)',
    description: 'Unidad de inteligencia de negocio, pipelines de datos, inferencia de modelos y gobernanza de información.',
  },
  {
    id: 'u4',
    symbol: 'x_4',
    name: 'Desarrollo de Software & Microservicios',
    unit: 'k$ (Miles USD)',
    description: 'Equipos ágiles de ingeniería, plataformas API, arquitecturas basadas en eventos y despliegue continuo.',
  },
];

export const FINANCIAL_VARIABLES_DEV: FinancialVariable[] = [
  {
    id: 'c1',
    symbol: 'x_1',
    name: 'Cómputo en la Nube & Clusters GPU',
    unit: 'k$ (Miles USD)',
    description: 'Presupuesto de procesamiento de entrenamiento/inferencia y máquinas virtuales dedicadas.',
  },
  {
    id: 'c2',
    symbol: 'x_2',
    name: 'Licenciamiento SaaS & Herramientas Dev',
    unit: 'k$ (Miles USD)',
    description: 'Suscripciones a suites de desarrollo, plataformas CI/CD, monitoreo APM y repositorios.',
  },
  {
    id: 'c3',
    symbol: 'x_3',
    name: 'Talento Especializado DevSecOps',
    unit: 'k$ (Miles USD)',
    description: 'Costos de ingeniería de confiabilidad de sitios (SRE), automatización y cultura de seguridad.',
  },
  {
    id: 'c4',
    symbol: 'x_4',
    name: 'Aseguramiento de Calidad QA & Resiliencia',
    unit: 'k$ (Miles USD)',
    description: 'Testing de estrés, pruebas de penetración, simulación de caos y entornos de staging.',
  },
];

export const FINANCIAL_VARIABLES_5X5: FinancialVariable[] = [
  ...FINANCIAL_VARIABLES_FLAGSHIP,
  {
    id: 'x5',
    symbol: 'x_5',
    name: 'Criptoactivos Regulados & Staking',
    unit: 'M$ (Millones USD)',
    description: 'Activo digital alternativo de alta beta con retorno por validación de red y rendimiento asimétrico.',
  },
];

export const FINANCIAL_VARIABLES_6X6: FinancialVariable[] = [
  ...FINANCIAL_VARIABLES_5X5,
  {
    id: 'x6',
    symbol: 'x_6',
    name: 'Capital de Riesgo Tecnológico (Venture Capital)',
    unit: 'M$ (Millones USD)',
    description: 'Participaciones tempranas en startups de deep-tech e inteligencia artificial generativa con horizonte a largo plazo.',
  },
];

export const INITIAL_SCENARIOS_DATA: Record<string, ScenarioDefinition> = {
  // 3 Escenarios Obligatorios
  ideal: {
    id: 'ideal',
    name: 'Escenario 1: Ideal (Estabilidad de Mercado)',
    badge: 'Condición Óptima κ ≈ 3.8',
    category: 'obligatorio',
    description: 'Mercado financiero en equilibrio macroeconómico con volatilidad controlada y diversificación efectiva entre activos.',
    financialContext: 'Los mercados de renta fija y variable operan dentro de bandas históricas normales. Las covarianzas cruzadas son reducidas (diversificación óptima) y los requerimientos de liquidez (vector b) corresponden a un presupuesto de inversión equilibrado de 77.0 M$.',
    A: [
      [10.0, 2.0, 1.0, 1.5],
      [2.0, 12.0, 2.5, 3.0],
      [1.0, 2.5, 9.0, 1.0],
      [1.5, 3.0, 1.0, 11.0],
    ],
    b: [15.0, 28.0, 12.0, 22.0],
    variables: FINANCIAL_VARIABLES_FLAGSHIP,
    defaultPreconditioner: 'jacobi',
    expectedConditionRatio: 'κ(A) ≈ 3.8 → κ(M⁻¹A) ≈ 1.9 (Convergencia en 4 iteraciones)',
  },
  estres: {
    id: 'estres',
    name: 'Escenario 2: Bajo Estrés Financiero (Shock Inflacionario y Volatilidad)',
    badge: 'Estrés Sistémico κ ≈ 18.5',
    category: 'obligatorio',
    description: 'Perturbación financiera por escalada inflacionaria y alza brusca en tasas de interés que aumenta el contagio inter-activos.',
    financialContext: 'Ante una crisis de crédito e inflación, las covarianzas cruzadas se disparan por efecto contagio (los activos pierden independencia estadística). El vector b refleja una demanda masiva de cobertura en bonos soberanos (32 M$) y oro (28 M$), reduciendo la asignación a riesgo tecnológico. Se evalúa cómo el método responde al desplazamiento del punto de equilibrio sin perder estabilidad numérica.',
    A: [
      [16.0, 6.0, 5.0, 4.5],
      [6.0, 22.0, 8.0, 7.0],
      [5.0, 8.0, 18.0, 6.0],
      [4.5, 7.0, 6.0, 19.0],
    ],
    b: [32.0, 10.0, 28.0, 14.0],
    variables: FINANCIAL_VARIABLES_FLAGSHIP,
    defaultPreconditioner: 'jacobi',
    expectedConditionRatio: 'κ(A) ≈ 18.5 → κ(M⁻¹A) ≈ 5.2 (Convergencia en 4 iteraciones)',
  },
  mal_condicionado: {
    id: 'mal_condicionado',
    name: 'Escenario 3: Mal Condicionado (Fuerte Disparidad de Escala & Acoplamiento)',
    badge: 'Mal Condicionamiento κ ≈ 2,840',
    category: 'obligatorio',
    description: 'Matriz con desbalance extremo en órdenes de magnitud entre activos (mal escalamiento diagonal) y alto acoplamiento cruzado.',
    financialContext: 'En carteras que integran mega-fondos soberanos corporativos junto a micro-finanzas o criptoactivos emergentes, los coeficientes de varianza varían en varios órdenes de magnitud (1450 vs 1.2). Esto estira los elipsoides del funcional cuadrático f(x) = ½ xᵀAx - bᵀx, provocando que el Gradiente Conjugado simple sufra zigzag y lenta convergencia. El Precondicionador de Jacobi (o SSOR) reescala el espacio euclídeo a una esfera casi perfecta, acelerando drásticamente el proceso iterativo.',
    A: [
      [1450.0, 28.0, 15.0, 35.0],
      [28.0, 1.2, 0.4, 0.5],
      [15.0, 0.4, 18.0, 2.0],
      [35.0, 0.5, 2.0, 220.0],
    ],
    b: [1500.0, 2.5, 20.0, 250.0],
    variables: FINANCIAL_VARIABLES_FLAGSHIP,
    defaultPreconditioner: 'jacobi',
    expectedConditionRatio: 'κ(A) ≈ 2,840 → κ(M⁻¹A) ≈ 6.1 (Reducción de condición de 99.7%)',
  },

  // Casos sugeridos de la Sección 4 por Mención Académica
  sistemas_recursos: {
    id: 'sistemas_recursos',
    name: 'Caso Ing. de Sistemas: Distribución de Recursos Interdepartamentales',
    badge: 'Mención Ing. Sistemas',
    category: 'mencion',
    description: 'Asignación de capital en 4 unidades tecnológicas con transferencias interdepartamentales y sinergias operativas.',
    financialContext: 'Matriz de insumo-producto que equilibra requerimientos de Cloud (x₁), Ciberseguridad (x₂), Analítica IA (x₃) y Desarrollo de Software (x₄). Los acoplamientos representan transferencias internas de servicios computacionales.',
    A: [
      [25.0, 4.0, 3.5, 5.0],
      [4.0, 18.0, 2.0, 3.0],
      [3.5, 2.0, 22.0, 6.0],
      [5.0, 3.0, 6.0, 30.0],
    ],
    b: [65.0, 42.0, 58.0, 80.0],
    variables: FINANCIAL_VARIABLES_SISTEMAS,
    defaultPreconditioner: 'jacobi',
    expectedConditionRatio: 'κ(A) ≈ 2.9 → Rápida convergencia en 4 iteraciones',
  },
  desarrollo_presupuesto: {
    id: 'desarrollo_presupuesto',
    name: 'Caso Desarrollo de Sistemas: Simulador de Presupuestos Cloud & DevOps',
    badge: 'Mención Desarrollo',
    category: 'mencion',
    description: 'Balance presupuestario en infraestructura ágil: Cómputo/GPU, Licencias SaaS, Talento DevSecOps y QA.',
    financialContext: 'Simula el ajuste de costos en arquitecturas escalables donde el escalamiento de GPUs (x₁) genera dependencia directa sobre licenciamiento de herramientas de observabilidad (x₂) y QA automatizado (x₄).',
    A: [
      [35.0, 8.0, 4.0, 7.0],
      [8.0, 15.0, 2.0, 3.5],
      [4.0, 2.0, 28.0, 5.0],
      [7.0, 3.5, 5.0, 20.0],
    ],
    b: [90.0, 35.0, 75.0, 50.0],
    variables: FINANCIAL_VARIABLES_DEV,
    defaultPreconditioner: 'jacobi',
    expectedConditionRatio: 'κ(A) ≈ 4.1 → Convergencia estable y simétrica',
  },

  // Casos ampliados n=5 y n=6 para demostrar n >= 4
  ampliado_5x5: {
    id: 'ampliado_5x5',
    name: 'Caso Ampliado n = 5: Cartera Multiactivo con Criptoderivados',
    badge: 'Dimensión n = 5 (5×5)',
    category: 'mencion',
    description: 'Modelo de optimización de riesgo en 5 clases de activos financieros incluyendo activos digitales y staking.',
    financialContext: 'Demostración de escalabilidad algorítmica para n=5. Se incorpora la variable x₅ (Criptoactivos Regulados) con varianza moderada y correlación parcial con tecnología e inflación.',
    A: [
      [14.0, 2.5, 1.2, 1.8, 0.8],
      [2.5, 18.0, 3.0, 4.0, 5.0],
      [1.2, 3.0, 12.0, 1.5, 2.0],
      [1.8, 4.0, 1.5, 15.0, 1.0],
      [0.8, 5.0, 2.0, 1.0, 24.0],
    ],
    b: [22.0, 38.0, 16.0, 25.0, 45.0],
    variables: FINANCIAL_VARIABLES_5X5,
    defaultPreconditioner: 'jacobi',
    expectedConditionRatio: 'κ(A) ≈ 3.4 → Convergencia en 5 iteraciones exactas',
  },
  corporativo_6x6: {
    id: 'corporativo_6x6',
    name: 'Caso Corporativo n = 6: Distribución de 6 Partidas Estratégicas',
    badge: 'Dimensión n = 6 (6×6)',
    category: 'mencion',
    description: 'Asignación institucional integral en 6 divisiones de inversión corporativa.',
    financialContext: 'Demostración de generalidad matemática del método de Suñagua (2020) en matrices de 6×6 dimensiones, satisfaciendo estrictamente el criterio de Sylvester y preservando tolerancia 10⁻⁶.',
    A: [
      [20.0, 3.0, 1.5, 2.0, 1.0, 2.5],
      [3.0, 25.0, 4.0, 3.5, 4.0, 5.0],
      [1.5, 4.0, 16.0, 2.0, 1.5, 1.0],
      [2.0, 3.5, 2.0, 18.0, 1.0, 2.0],
      [1.0, 4.0, 1.5, 1.0, 22.0, 3.0],
      [2.5, 5.0, 1.0, 2.0, 3.0, 28.0],
    ],
    b: [30.0, 55.0, 22.0, 35.0, 40.0, 60.0],
    variables: FINANCIAL_VARIABLES_6X6,
    defaultPreconditioner: 'jacobi',
    expectedConditionRatio: 'κ(A) ≈ 3.2 → Resolución en 6 iteraciones',
  },
};

export const SCENARIOS_DATA = INITIAL_SCENARIOS_DATA;
