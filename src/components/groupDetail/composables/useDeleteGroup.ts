import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'

import apis from '/@/lib/apis'

export const useDeleteGroup = () => {
  const router = useRouter()

  const groupStore = useGroupStore()
  const toast = useToast()

  const { groups } = storeToRefs(groupStore)

  const isDeleting = ref(false)

  const deleteGroup = async (id: string) => {
    if (!confirm('本当にこのグループを削除しますか？')) {
      return
    }
    try {
      isDeleting.value = true
      await apis.deleteGroup(id)
      if (groups.value !== undefined) {
        groups.value = groups.value.filter(group => group.id !== id)
        router.push('/group')
      } else {
        throw new Error('group does not exist')
      }
      toast.success('グループを削除しました')
    } catch {
      toast.error('グループの削除に失敗しました')
    } finally {
      isDeleting.value = false
    }
  }
  return { isDeleting, deleteGroup }
}
