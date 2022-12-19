import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

import { useGroupDetailStore } from '/@/stores/groupDetail'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

export const useGroupMember = () => {
  const groupDetailStore = useGroupDetailStore()
  const toast = useToast()

  const { users } = storeToRefs(useUserStore())
  const { group } = storeToRefs(groupDetailStore)

  const absentMemberOptions = computed(() => {
    if (users.value === undefined) {
      return []
    }
    return users.value
      .filter(user => !group.value?.members.includes(user.id))
      .map(user => {
        return {
          key: user.name,
          value: user.id
        }
      })
  })

  const isSending = ref(false)

  const addMembers = async (membersToBeAdded: string[]) => {
    if (membersToBeAdded.length === 0 || group.value === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.postGroupMembers(group.value.id, membersToBeAdded)
      const nextGroup = {
        ...group.value,
        members: [...group.value.members, ...membersToBeAdded]
      }
      group.value = nextGroup
      toast.success('メンバーを追加しました')
    } catch {
      toast.error('グループメンバーの追加に失敗しました')
    } finally {
      isSending.value = false
    }
  }
  const removeMember = async (id: string) => {
    if (group.value === undefined) {
      return
    }
    try {
      isSending.value = true
      await apis.deleteGroupMembers(group.value.id, [id])
      const nextGroup = {
        ...group.value,
        members: group.value.members.filter(member => member !== id)
      }
      group.value = nextGroup
      toast.success('メンバーを削除しました')
    } catch {
      toast.error('グループメンバーの削除に失敗しました')
    } finally {
      isSending.value = false
    }
  }
  return { absentMemberOptions, isSending, addMembers, removeMember }
}
