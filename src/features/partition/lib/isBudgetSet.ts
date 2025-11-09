export const isBudgetSet = (
  budget: number | null | undefined
): budget is number => Number.isFinite(budget)
