import { usePartitionStore } from '@/features/partition/store'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'

const { partitionGroupOptions, fetchPartitionGroups, isPartitionGroupFetched } =
  usePartitionGroupStore()
const getPartitionGroupNameById = async (
  id: string | undefined | null
): Promise<string> => {
  if (!id) return '指定なし'
  if (!isPartitionGroupFetched.value) {
    await fetchPartitionGroups()
  }
  return (
    partitionGroupOptions.value.find(
      ({ value }: { value: string }) => value === id
    )?.key ?? '指定なし'
  )
}

export const loadPartitionGroupNames = async () => {
  const { partitions, isPartitionFetched, fetchPartitions } =
    usePartitionStore()
  if (!isPartitionFetched.value) {
    await fetchPartitions()
  }
  const ids = [
    ...new Set(
      partitions.value
        .map(partitions => partitions.parentPartitionGroupId)
        .filter((id: string): id is string => !!id)
    )
  ]
  const promises = ids.map(
    async id => [id, await getPartitionGroupNameById(id)] as const
  )
  const partitionGroupNames = await Promise.all(promises)
  return new Map(partitionGroupNames)
}
