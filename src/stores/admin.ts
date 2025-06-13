import { computed, ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import { useUserStore } from '/@/stores/user'

export const useAdminStore = defineComposable('admin', () => {
  const { userMap } = useUserStore()

  const admins = ref<string[]>([])
  const isAdminFetched = ref(false)

  const adminOptions = computed(() =>
    admins.value.map(admin => ({
      key: userMap.value[admin],
      value: admin
    }))
  )

  return {
    admins,
    adminOptions,
    isAdminFetched
  }
})
