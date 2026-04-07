/**
 * Legacy entry point. The original PerStudentCalculator is now
 * CostCalculator under ./calculator/. This file re-exports it under
 * the historical name so existing imports (e.g. /solutions/k12) keep
 * working unchanged.
 */

export { CostCalculator as PerStudentCalculator } from "./calculator/cost-calculator";
export type { CostCalculatorProps as PerStudentCalculatorProps } from "./calculator/cost-calculator";
