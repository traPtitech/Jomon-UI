import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import type { PartitionSeed } from '/@/features/partition/model'
import { createPartitionUsecase } from '/@/features/partition/usecase'

export const useNewPartition = () => {
  const isSending = ref(false)
  const toast = useToast()
  const router = useRouter()
  const partition = ref<PartitionSeed>({
    name: '',
    budget: 0,
    management: {
      category: 'manual',
      state: 'available'
    }
  })
  const handleCreatePartition = async () => {
    if (partition.value.name === '') {
      toast.warning('パーティション名は必須です')
      return
    }
    try {
      await createPartitionUsecase(partition.value)
      toast.success('パーティションを作成しました')
      router.push('/partitions')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
  }

  return { isSending, partition, handleCreatePartition }
}
