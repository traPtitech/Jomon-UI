import { computed, ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import { useUserStore } from '/@/stores/user'

export const useAccountManagerStore = defineComposable('accountManager', () => {
  const { userMap } = useUserStore()

  const accountManagers = ref<string[]>([])
  const isAccountManagerFetched = ref(false)

  const accountManagerOptions = computed(() =>
    accountManagers.value.map(accountManager => ({
      key: userMap.value[accountManager],
      value: accountManager
    }))
  )

  return {
    accountManagers,
    accountManagerOptions,
    isAccountManagerFetched
  }
})
