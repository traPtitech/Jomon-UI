import type { PartitionSeed } from '@/features/partition/entities'

export type PartitionSeedDraft = Omit<
  PartitionSeed,
  'parentPartitionGroupId'
> & {
  parentPartitionGroupId: string | null
}
