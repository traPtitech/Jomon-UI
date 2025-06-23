import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { deletePartitionUsecase } from '/@/features/partition/usecase'

export const useDeletePartition = () => {
  const router = useRouter()

  const toast = useToast()

  const isDeleting = ref(false)

  const deletePartition = async (id: string) => {
    if (!confirm('本当にこのパーティションを削除しますか？')) {
      return
    }
    try {
      isDeleting.value = true
      await deletePartitionUsecase(id)
      toast.success('パーティションを削除しました')
      router.push('/partitions')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e)
      }
    }
    isDeleting.value = false
  }
  return { isDeleting, deletePartition }
}
