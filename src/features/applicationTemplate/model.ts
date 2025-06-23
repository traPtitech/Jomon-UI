import clubBudgetApplicationTemplate from './clubBudgetApplication.md?raw'
import travelingExpenseApplicationTemplate from './travelingExpenseApplication.md?raw'

export const applicationTemplates = [
  { name: '部費利用申請', value: clubBudgetApplicationTemplate },
  { name: '交通費申請', value: travelingExpenseApplicationTemplate }
] as const

export type ApplicationTemplate = (typeof applicationTemplates)[number]['name']
