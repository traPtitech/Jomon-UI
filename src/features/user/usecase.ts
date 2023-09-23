import { storeToRefs } from 'pinia'

import { useUserStore } from '/@/stores/user'

import { useUserRepository } from '/@/features/user/repository'

export const useFetchUsers = async () => {
  const repository = useUserRepository()
  const { users, isUserFetched } = storeToRefs(useUserStore())

  try {
    users.value = await repository.fetchUsers()
    isUserFetched.value = true
  } catch {
    throw new Error('ユーザー一覧の取得に失敗しました')
  }
}

export const useFetchMe = async () => {
  const repository = useUserRepository()
  const { me, isMeFetched } = storeToRefs(useUserStore())

  if (isMeFetched.value) return

  try {
    me.value = await repository.fetchMe()
    isMeFetched.value = true
  } catch {
    throw new Error('ユーザーの取得に失敗しました')
  }
}
