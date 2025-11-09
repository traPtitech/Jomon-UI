export const isBudgetNotSet = (
  budget: number | null | undefined
): budget is null | undefined => budget == null
