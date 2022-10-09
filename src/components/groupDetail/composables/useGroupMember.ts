import { ref, computed } from 'vue'

import { useToastStore } from '/@/stores/toast'
import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupMember = (group: GroupDetail) => {
  const { users } = useUserStore()
  const toastStore = useToastStore()

  const absentMemberOptions = computed(() => {
    if (users === undefined) {
      return []
    }
    return users
      .filter(user => !group.members.includes(user.name))
      .map(user => {
        return {
          key: user.name,
          value: user.name
        }
      })
  })

  const isSending = ref(false)

  const addMembers = async (
    membersToBeAdded: string[],
    emit: (e: 'fixGroup', group: GroupDetail) => void
  ) => {
    if (membersToBeAdded.length !== 0) {
      try {
        isSending.value = true
        await apis.postGroupMembers(group.id, membersToBeAdded)
        const nextGroup = {
          ...group,
          members: [...group.members, ...membersToBeAdded]
        }
        emit('fixGroup', nextGroup)
      } catch {
        toastStore.showToast({
          type: 'error',
          message: 'グループメンバーの追加に失敗しました'
        })
      } finally {
        isSending.value = false
      }
    }
  }
  const removeMember = async (
    id: string,
    emit: (e: 'fixGroup', group: GroupDetail) => void
  ) => {
    try {
      isSending.value = true
      await apis.deleteGroupMembers(group.id, [id])
      const nextGroup = {
        ...group,
        members: group.members.filter(member => member !== id)
      }
      emit('fixGroup', nextGroup)
    } catch {
      toastStore.showToast({
        type: 'error',
        message: 'グループメンバーの削除に失敗しました'
      })
    } finally {
      isSending.value = false
    }
  }
  return { absentMemberOptions, isSending, addMembers, removeMember }
}
