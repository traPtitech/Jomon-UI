import { ref } from 'vue'

import { useRouter } from 'vue-router'

import { useToast } from 'vue-toastification'

import type { PartitionGroupSeed } from '@/features/partitionGroup/entities'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'

export const useNewPartitionGroup = () => {
  const isSending = ref(false)
  const toast = useToast()
  const router = useRouter()
  const { createPartitionGroup } = usePartitionGroupStore()
  const partitionGroup = ref<PartitionGroupSeed>({
    name: '',
    parentPartitionGroupId: null,
    depth: 1,
  })
  const handleCreatePartitionGroup = async () => {
    if (partitionGroup.value.name === '') {
      toast.warning('パーティショングループ名は必須です')
      return
    }
    try {
      isSending.value = true
      await createPartitionGroup(partitionGroup.value)
      toast.success('パーティショングループを作成しました')
      await router.push('/partitions')
    } catch (e) {
      if (e instanceof Error && e.message) {
        toast.error(e.message)
      } else {
        toast.error('パーティショングループの作成に失敗しました')
      }
    }
    isSending.value = false
  }

  return { isSending, partitionGroup, handleCreatePartitionGroup }
}
