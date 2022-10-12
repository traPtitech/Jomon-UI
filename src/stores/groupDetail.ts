import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

import type { PostGroup, User } from '/@/lib/apis'
import apis, { type GroupDetail } from '/@/lib/apis'

export const useGroupDetailStore = defineStore('groupDetail', () => {
  const toast = useToast()

  const group = ref<GroupDetail>()

  const editedValue = ref({
    name: '',
    description: '',
    budget: 0
  })
  const canEditGroup = (user: User | undefined) => {
    if (!user) return false
    return user.admin || group.value?.owners.includes(user.name)
  }

  const putGroup = async (id: string, willPutGroup: PostGroup) => {
    if (group.value === undefined) {
      return
    }
    try {
      const res = (await apis.putGroupDetail(id, willPutGroup)).data
      const nextGroup: GroupDetail = {
        ...group.value,
        name: res.name,
        description: res.description,
        budget: res.budget
      }
      editedValue.value = {
        name: nextGroup.name,
        description: nextGroup.description,
        budget: nextGroup.budget
      }
      toast.success('グループを修正しました')
    } catch {
      toast.error('グループの更新に失敗しました')
      editedValue.value = {
        name: group.value.name,
        description: group.value.description,
        budget: group.value.budget
      }
    }
  }

  const fetchGroup = async (id: string) => {
    try {
      group.value = (await apis.getGroupDetail(id)).data
      editedValue.value = {
        name: group.value.name,
        description: group.value.description,
        budget: group.value.budget
      }
    } catch {
      toast.error('グループの取得に失敗しました')
    }
  }

  return {
    group,
    editedValue,
    canEditGroup,
    fetchGroup,
    putGroup
  }
})
