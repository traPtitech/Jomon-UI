import { computed, ref } from 'vue'
import type { User } from '/@/features/user/model'
import { defineComposable } from '/@/lib/store'

export const useUserStore = defineComposable('user', () => {
  const me = ref<User>()
  const users = ref<User[]>([])
  const isUserFetched = ref(false)
  const isMeFetched = ref(false)

  const isAccountManager = computed(() => {
    if (!me.value) return false
    return me.value.accountManager
  })

  const userOptions = computed(() =>
    users.value.map(user => {
      return {
        key: user.name,
        value: user.id
      }
    })
  )

  const userMap = computed(
    () =>
      users.value?.reduce(
        (acc, user) => {
          acc[user.id] = user.name
          return acc
        },
        {} as Record<string, string>
      ) ?? {}
  )

  return {
    me,
    users,
    isAccountManager,
    userOptions,
    isUserFetched,
    isMeFetched,
    userMap
  }
})
