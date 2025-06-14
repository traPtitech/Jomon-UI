import { useAdminStore } from '/@/stores/admin'

import { useAdminRepository } from './repository'

export const useFetchAdminsUsecase = async () => {
  const repository = useAdminRepository()
  const { admins, isAdminFetched } = useAdminStore()

  try {
    admins.value = await repository.fetchAdmins()
    isAdminFetched.value = true
  } catch {
    throw new Error('会計士の取得に失敗しました')
  }
}

export const addAdminsUsecase = async (adminsSeed: string[]) => {
  const repository = useAdminRepository()
  const { admins } = useAdminStore()

  try {
    const res = await repository.addAdmins(adminsSeed)
    admins.value.push(...res)
  } catch {
    throw new Error('会計士の追加に失敗しました')
  }
}

export const removeAdminsUsecase = async (adminsSeed: string[]) => {
  const repository = useAdminRepository()
  const { admins } = useAdminStore()

  try {
    await repository.removeAdmins(adminsSeed)
    admins.value = admins.value.filter(admin => !adminsSeed.includes(admin))
  } catch {
    throw new Error('会計士の削除に失敗しました')
  }
}
