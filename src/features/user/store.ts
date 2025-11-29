import type { User } from './entities'
import { UserRepositoryKey } from '@/di'
import { defineStoreComposable } from '@/lib/store'
import type { AsyncStatus } from '@/types'
import { computed, inject, ref } from 'vue'

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
      value: user.id
    }))
  )
  const userMap = computed(() =>
    users.value.reduce<Record<string, string>>((acc, user) => {
      acc[user.id] = user.name
      return acc
    }, {})
  )

  const getUserName = (id: string): string | undefined => userMap.value[id]

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
      throw new Error(error.value)
    }
  }

  const fetchMe = async () => {
    if (isMeFetched.value) return

    try {
      me.value = await repository.fetchMe()
      isMeFetched.value = true
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
    fetchUsers,
    fetchMe,
    reset
  }
})

export type UserStore = ReturnType<typeof useUserStore>
