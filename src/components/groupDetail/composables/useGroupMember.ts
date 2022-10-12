import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

export const useGroupMember = () => {
  const groupDetailStore = useGroupDetailStore()
  const { users } = useUserStore()
  const toast = useToast()

  const absentMemberOptions = computed(() => {
    if (users === undefined) {
      return []
    }
    return users
      .filter(user => !groupDetailStore.group?.members.includes(user.name))
      .map(user => {
        return {
          key: user.name,
          value: user.name
        }
      })
  })

  const isSending = ref(false)

  const addMembers = async (membersToBeAdded: string[]) => {
    if (membersToBeAdded.length === 0 || groupDetailStore.group === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.postGroupMembers(groupDetailStore.group.id, membersToBeAdded)
      const nextGroup = {
        ...groupDetailStore.group,
        members: [...groupDetailStore.group.members, ...membersToBeAdded]
      }
      groupDetailStore.group = nextGroup
    } catch {
      toast.error('グループメンバーの追加に失敗しました')
    } finally {
      isSending.value = false
    }
  }
  const removeMember = async (id: string) => {
    if (groupDetailStore.group === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.deleteGroupMembers(groupDetailStore.group.id, [id])
      const nextGroup = {
        ...groupDetailStore.group,
        members: groupDetailStore.group.members.filter(member => member !== id)
      }
      groupDetailStore.group = nextGroup
    } catch {
      toast.error('グループメンバーの削除に失敗しました')
    } finally {
      isSending.value = false
    }
  }
  return { absentMemberOptions, isSending, addMembers, removeMember }
}
