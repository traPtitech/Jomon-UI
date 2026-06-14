import { computed, inject, ref } from 'vue'

import { defineStoreComposable } from '@/lib/store'

import { UserRepositoryKey } from '@/di'
import type { AsyncStatus } from '@/types'

import type { User } from './entities'

export const useUserStore = defineStoreComposable('user', () => {
  const repository = inject(UserRepositoryKey)
  if (!repository) throw new Error('UserRepository is not provided')

  const me = ref<User | undefined>(undefined)
  const users = ref<User[]>([])
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)
  const isMeFetched = ref(false)

  const isAccountManager = computed(() => Boolean(me.value?.accountManager))
  const userOptions = computed(() =>
    users.value.map(user => ({
      key: user.name,
      value: user.id,
    }))
  )
  const userMap = computed(() =>
    users.value.reduce<Record<string, string>>((acc, user) => {
      acc[user.id] = user.name
      return acc
    }, {})
  )

  const UNKNOWN_USER_FALLBACK = '不明なユーザー'

  const getUserName = (id: string): string | undefined => userMap.value[id]
  const getUserNameWithFallback = (id: string): string =>
    userMap.value[id] ?? UNKNOWN_USER_FALLBACK

  const isUserFetched = computed(() => status.value === 'success')

  const fetchUsers = async () => {
    status.value = 'loading'
    error.value = null

    try {
      users.value = await repository.fetchUsers()
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      error.value = 'ユーザー一覧の取得に失敗しました: ' + String(e)
      throw new Error(error.value, { cause: e })
    }
  }

  type FetchMeOptions = {
    force?: boolean
  }

  const fetchMe = async (options: FetchMeOptions = {}) => {
    const { force = false } = options

    if (isMeFetched.value && !force) return me.value

    try {
      me.value = await repository.fetchMe()
      isMeFetched.value = true
      return me.value
    } catch {
      throw new Error('ユーザーの取得に失敗しました')
    }
  }

  const reset = () => {
    me.value = undefined
    users.value = []
    status.value = 'idle'
    error.value = null
    isMeFetched.value = false
  }

  return {
    me,
    users,
    status,
    error,
    isUserFetched,
    isMeFetched,
    isAccountManager,
    userOptions,
    userMap,
    getUserName,
    getUserNameWithFallback,
    fetchUsers,
    fetchMe,
    reset,
  }
})

export type UserStore = ReturnType<typeof useUserStore>
