import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

export const useGroupOwner = () => {
  const groupDetailStore = useGroupDetailStore()
  const { users } = useUserStore()
  const toast = useToast()

  const absentOwnerOptions = computed(() => {
    if (users === undefined) {
      return []
    }
    return users
      .filter(user => !groupDetailStore.group?.owners.includes(user.name))
      .map(user => {
        return {
          key: user.name,
          value: user.name
        }
      })
  })

  const isSending = ref(false)

  const addOwners = async (ownersToBeAdded: string[]) => {
    if (ownersToBeAdded.length === 0 || groupDetailStore.group === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.postGroupOwners(groupDetailStore.group.id, ownersToBeAdded)
      const nextGroup = {
        ...groupDetailStore.group,
        owners: [...groupDetailStore.group.owners, ...ownersToBeAdded]
      }
      groupDetailStore.group = nextGroup
      toast.success('オーナーを追加しました')
    } catch {
      toast.error('グループオーナーの追加に失敗しました')
    } finally {
      isSending.value = false
    }
  }
  const removeOwner = async (id: string) => {
    if (groupDetailStore.group === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.deleteGroupOwners(groupDetailStore.group.id, [id])
      const nextGroup = {
        ...groupDetailStore.group,
        owners: groupDetailStore.group.owners.filter(owner => owner !== id)
      }
      groupDetailStore.group = nextGroup
      toast.success('オーナーを削除しました')
    } catch {
      toast.error('グループオーナーの削除に失敗しました')
    } finally {
      isSending.value = false
    }
  }
  return { absentOwnerOptions, isSending, addOwners, removeOwner }
}
