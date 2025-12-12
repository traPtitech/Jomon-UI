export interface ApplicationTargetDraft {
  amount: number | null
  target: string | null
}

export type ApplicationTargetEditDraft = ApplicationTargetDraft & { id: string }
