import { storeToRefs } from 'pinia'

import { useAdminStore } from '/@/stores/admin'

import { useAdminRepository } from '/@/features/admin/repository'

export const useFetchTags = async () => {
  const repository = useAdminRepository()
  const { admins, isAdminFetched } = storeToRefs(useAdminStore())

  if (isAdminFetched.value) return

  try {
    admins.value = await repository.fetchAdmins()
    isAdminFetched.value = true
  } catch {
    throw new Error('管理者の取得に失敗しました')
  }
}

export const addAdmins = async (adminsSeed: string[]) => {
  const repository = useAdminRepository()
  const { admins } = storeToRefs(useAdminStore())

  try {
    const res = await repository.addAdmins(adminsSeed)
    admins.value.push(...res)
  } catch {
    throw new Error('管理者の追加に失敗しました')
  }
}

export const removeAdmins = async (adminsSeed: string[]) => {
  const repository = useAdminRepository()
  const { admins } = storeToRefs(useAdminStore())

  try {
    await repository.removeAdmins(adminsSeed)
    admins.value = admins.value.filter(admin => !adminsSeed.includes(admin))
  } catch {
    throw new Error('管理者の削除に失敗しました')
  }
}
