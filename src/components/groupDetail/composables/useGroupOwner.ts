import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

import { addGroupOwnersUsecase } from '/@/features/group/usecase'

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
      .map(user => ({
        key: user.name,
        value: user.id
      }))
  })

  const isSending = ref(false)

  const addOwners = async (ownersToBeAdded: string[]) => {
    if (group.value === undefined) {
      return
    }
    try {
      isSending.value = true
      await addGroupOwnersUsecase(group.value.id, ownersToBeAdded)
      toast.success('グループオーナーを追加しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
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
      toast.success('グループオーナーを削除しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }
  return { absentOwnerOptions, isSending, addOwners, removeOwner }
}
