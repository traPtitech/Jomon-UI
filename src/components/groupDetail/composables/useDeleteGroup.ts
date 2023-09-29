import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { deleteGroupUsecase } from '/@/features/group/usecase'

export const useDeleteGroup = () => {
  const router = useRouter()

  const toast = useToast()

  const isDeleting = ref(false)

  const deleteGroup = async (id: string) => {
    if (!confirm('本当にこのグループを削除しますか？')) {
      return
    }
    try {
      isDeleting.value = true
      await deleteGroupUsecase(id)
      toast.success('グループを削除しました')
      router.push('/groups')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e)
      }
    }
    isDeleting.value = false
  }
  return { isDeleting, deleteGroup }
}
