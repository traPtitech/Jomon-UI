import type { PartitionSeed } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export const useNewPartition = () => {
  const isSending = ref(false)
  const toast = useToast()
  const router = useRouter()
  const { createPartition } = usePartitionStore()
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
      isSending.value = true
      await createPartition(partition.value)
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
