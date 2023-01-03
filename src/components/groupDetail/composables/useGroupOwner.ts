import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

export const useGroupOwner = () => {
  const groupDetailStore = useGroupDetailStore()
  const toast = useToast()

  const { users } = storeToRefs(useUserStore())
  const { group } = storeToRefs(groupDetailStore)

  const absentOwnerOptions = computed(() => {
    if (users.value === undefined) {
      return []
    }
    return users.value
      .filter(user => !group.value?.owners.includes(user.id))
      .map(user => {
        return {
          key: user.name,
          value: user.id
        }
      })
  })

  const isSending = ref(false)

  const addOwners = async (ownersToBeAdded: string[]) => {
    if (ownersToBeAdded.length === 0 || group.value === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.postGroupOwners(group.value.id, ownersToBeAdded)
      const nextGroup = {
        ...group.value,
        owners: [...group.value.owners, ...ownersToBeAdded]
      }
      group.value = nextGroup
      toast.success('オーナーを追加しました')
    } catch {
      toast.error('グループオーナーの追加に失敗しました')
    }
    isSending.value = false
  }
  const removeOwner = async (id: string) => {
    if (group.value === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.deleteGroupOwners(group.value.id, [id])
      const nextGroup = {
        ...group.value,
        owners: group.value.owners.filter(owner => owner !== id)
      }
      group.value = nextGroup
      toast.success('オーナーを削除しました')
    } catch {
      toast.error('グループオーナーの削除に失敗しました')
    }
    isSending.value = false
  }
  return { absentOwnerOptions, isSending, addOwners, removeOwner }
}
