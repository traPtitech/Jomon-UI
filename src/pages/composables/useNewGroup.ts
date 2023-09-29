import { storeToRefs } from 'pinia'
import { ref } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { GroupSeedWithMemberAndOwners } from '/@/features/group/model'

export const useNewGroup = () => {
  const userStore = useUserStore()
  const { me } = storeToRefs(userStore)

  const isSending = ref(false)

  const group = ref<GroupSeedWithMemberAndOwners>({
    name: '',
    description: '',
    budget: 0,
    owners: me.value?.id ? [me.value.id] : [],
    members: []
  })

  return { isSending, group }
}
