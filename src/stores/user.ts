import { computed, ref } from 'vue'
import { defineComposable } from '/@/lib/store'
import type { User } from '/@/features/user/model'

export const useUserStore = defineComposable('user', () => {
  const me = ref<User>()
  const users = ref<User[]>([])
  const isUserFetched = ref(false)
  const isMeFetched = ref(false)

  const isAdmin = computed(() => {
    if (!me.value) return false
    return me.value.admin
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
    isAdmin,
    userOptions,
    isUserFetched,
    isMeFetched,
    userMap
  }
})
