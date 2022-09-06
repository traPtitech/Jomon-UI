import { ref, computed } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupMember = (group: GroupDetail) => {
  const { users } = useUserStore()

  const absentMembers = computed(() => {
    if (users === undefined) {
      return []
    }
    return users.filter(member => !group.members.includes(member.name))
  })

  const isSending = ref(false)

  const addMembers = async (
    members: string[],
    emit: (e: 'fixGroup', group: GroupDetail) => void
  ) => {
    if (members.length !== 0) {
      try {
        isSending.value = true
        const res = (await apis.postGroupMembers(group.id, members)).data
        const nextGroup = {
          ...group,
          members: [...group.members, ...res]
        }
        emit('fixGroup', nextGroup)
      } catch (err) {
        alert(err)
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
    } catch (err) {
      alert(err)
    } finally {
      isSending.value = false
    }
  }
  return { absentMembers, isSending, addMembers, removeMember }
}
