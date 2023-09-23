import clubBudgetRequestTemplate from '/@/md/clubBudgetRequest.md?raw'
import travelingExpenseRequestTemplate from '/@/md/travelingExpenseRequest.md?raw'

export const requestTemplates = [
  { name: '部費利用申請', value: clubBudgetRequestTemplate },
  { name: '交通費申請', value: travelingExpenseRequestTemplate }
] as const

const requestTemplateNames = requestTemplates.map(v => v.name)
export type RequestTemplate = typeof requestTemplateNames[number]
