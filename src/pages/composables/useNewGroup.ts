import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

import apis, { type Group as APIGroup } from '/@/lib/apis'

interface NewGroup {
  name: string
  description: string
  budget: number
  owners: string[]
  members: string[]
}

export const useNewGroup = () => {
  const toast = useToast()
  const router = useRouter()

  const userStore = useUserStore()
  const groupStore = useGroupStore()
  const { me } = storeToRefs(userStore)
  const { groups } = storeToRefs(groupStore)

  const isSending = ref(false)

  const group = ref<NewGroup>({
    name: '',
    description: '',
    budget: 0,
    owners: me.value?.id ? [me.value.id] : [],
    members: []
  })

  const postGroup = async (e: Event) => {
    if (group.value.owners.length === 0) {
      toast.warning('オーナーは必須です')
      return
    }
    const willPostGroup = {
      name: group.value.name,
      description: group.value.description,
      budget: group.value.budget
    }
    isSending.value = true
    try {
      const response: APIGroup = (await apis.postGroup(willPostGroup)).data
      if (groups.value !== undefined) {
        groups.value.unshift(response)
      } else {
        groups.value = [response]
      }
      try {
        await Promise.all([
          apis.postGroupMembers(response.id, group.value.members),
          apis.postGroupOwners(response.id, group.value.owners)
        ])
        toast.success('グループを作成しました')
        router.push(`/groups`)
      } catch {
        toast.error('グループの作成に失敗しました')
      }
    } catch {
      toast.error('グループの作成に失敗しました')
    }
    isSending.value = false
  }
  return { isSending, group, postGroup }
}
