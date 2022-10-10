import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'

import apis from '/@/lib/apis'

export const useDeleteGroup = () => {
  const router = useRouter()

  const groupStore = useGroupStore()
  const toast = useToast()

  const isDeleting = ref(false)

  const deleteGroup = async (id: string) => {
    if (!confirm('本当にこのグループを削除しますか？')) {
      return
    }
    try {
      isDeleting.value = true
      await apis.deleteGroup(id)
      if (groupStore.groups !== undefined) {
        groupStore.groups = groupStore.groups.filter(group => group.id !== id)
        router.push('/group')
      } else {
        throw new Error('group does not exist')
      }
    } catch {
      toast.error('グループの削除に失敗しました')
    } finally {
      isDeleting.value = false
    }
  }
  return { isDeleting, deleteGroup }
}
