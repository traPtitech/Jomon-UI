import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGroupStore } from '/@/stores/group'
import { useToastStore } from '/@/stores/toast'

import apis from '/@/lib/apis'

export const useDeleteGroup = () => {
  const router = useRouter()

  const groupStore = useGroupStore()
  const toastStore = useToastStore()

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
      toastStore.showToast({
        type: 'error',
        message: 'グループの削除に失敗しました'
      })
    } finally {
      isDeleting.value = false
    }
  }
  return { isDeleting, deleteGroup }
}
