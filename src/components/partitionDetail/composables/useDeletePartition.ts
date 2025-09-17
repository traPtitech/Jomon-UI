import { usePartitionStore } from '@/features/partition/store'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

export const useDeletePartition = () => {
  const router = useRouter()

  const toast = useToast()
  const { deletePartition: deletePartitionAction } = usePartitionStore()

  const isDeleting = ref(false)

  const deletePartition = async (id: string) => {
    if (!confirm('本当にこのパーティションを削除しますか？')) {
      return
    }
    try {
      isDeleting.value = true
      await deletePartitionAction(id)
      toast.success('パーティションを削除しました')
      router.push('/partitions')
    } catch (e) {
      if (e instanceof Error && e.message) {
        toast.error(e.message)
      } else {
        toast.error('パーティションの削除に失敗しました')
      }
    }
    isDeleting.value = false
  }
  return { isDeleting, deletePartition }
}
