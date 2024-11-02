import clubBudgetRequestTemplate from './clubBudgetRequest.md?raw'
import travelingExpenseRequestTemplate from './travelingExpenseRequest.md?raw'

export const requestTemplates = [
  { name: '部費利用申請', value: clubBudgetRequestTemplate },
  { name: '交通費申請', value: travelingExpenseRequestTemplate }
] as const

export type RequestTemplate = (typeof requestTemplates)[number]['name']
