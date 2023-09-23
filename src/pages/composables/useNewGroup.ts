import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { useGroupStore } from '/@/stores/group'
import { useUserStore } from '/@/stores/user'

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

  return { isSending, group }
}
