import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { useToast } from 'vue-toastification'

import type { PartitionSeed } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'

export const useNewPartition = () => {
  const isSending = ref(false)
  const toast = useToast()
  const router = useRouter()
  const { createPartition } = usePartitionStore()
  const partition = ref<
    Omit<PartitionSeed, 'parentPartitionGroupId'> & {
      parentPartitionGroupId: string | null
    }
  >({
    name: '',
    budget: 0,
    parentPartitionGroupId: null,
    management: {
      category: 'manual',
      state: 'available',
    },
  })
  const handleCreatePartition = async () => {
    if (partition.value.name === '') {
      toast.warning('パーティション名は必須です')
      return
    }
    try {
      isSending.value = true
      // We only allow submission if validation passes, so assertion is safe here or we can check again.
      // But PartitionSeed expects string. SearchSelect might be cleared.
      // If required, we should add validation.
      if (!partition.value.parentPartitionGroupId) {
        toast.warning('所属するパーティショングループは必須です')
        return
      }
      await createPartition({
        ...partition.value,
        parentPartitionGroupId: partition.value.parentPartitionGroupId,
      })
      toast.success('パーティションを作成しました')
      await router.push('/partitions')
    } catch (e) {
      if (e instanceof Error && e.message) {
        toast.error(e.message)
      } else {
        toast.error('パーティションの作成に失敗しました')
      }
    }
    isSending.value = false
  }

  return { isSending, partition, handleCreatePartition }
}
