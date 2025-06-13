import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import {
  addGroupMembersUsecase,
  removeGroupMembersUsecase
} from '/@/features/group/usecase'

export const useGroupMember = () => {
  const { users } = useUserStore()
  const { group } = useGroupDetailStore()
  const toast = useToast()

  const absentMemberOptions = computed(() => {
    if (users.value === undefined) {
      return []
    }
    return users.value
      .filter(user => !group.value?.members.includes(user.id))
      .map(user => ({
        key: user.name,
        value: user.id
      }))
  })

  const isSending = ref(false)

  const addMembers = async (membersToBeAdded: string[]) => {
    if (group.value === undefined) {
      return
    }
    try {
      isSending.value = true
      await addGroupMembersUsecase(group.value.id, membersToBeAdded)
      toast.success('グループメンバーを追加しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }

  const removeMember = async (id: string) => {
    if (group.value === undefined) {
      return
    }
    try {
      isSending.value = true
      await removeGroupMembersUsecase(group.value.id, [id])
      toast.success('グループメンバーを削除しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }
  return { absentMemberOptions, isSending, addMembers, removeMember }
}
