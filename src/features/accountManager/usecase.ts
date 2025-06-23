import { useAccountManagerStore } from '/@/stores/accountManager'

import { useAccountManagerRepository } from './repository'

export const useFetchAccountManagersUsecase = async () => {
  const repository = useAccountManagerRepository()
  const { accountManagers, isAccountManagerFetched } = useAccountManagerStore()

  try {
    accountManagers.value = await repository.fetchAccountManagers()
    isAccountManagerFetched.value = true
  } catch {
    throw new Error('会計管理者の取得に失敗しました')
  }
}

export const addAccountManagersUsecase = async (
  accountManagersSeed: string[]
) => {
  const repository = useAccountManagerRepository()
  const { accountManagers } = useAccountManagerStore()

  try {
    const res = await repository.addAccountManagers(accountManagersSeed)
    accountManagers.value.push(...res)
  } catch {
    throw new Error('会計管理者の追加に失敗しました')
  }
}

export const removeAccountManagersUsecase = async (
  accountManagersSeed: string[]
) => {
  const repository = useAccountManagerRepository()
  const { accountManagers } = useAccountManagerStore()

  try {
    await repository.removeAccountManagers(accountManagersSeed)
    accountManagers.value = accountManagers.value.filter(
      accountManager => !accountManagersSeed.includes(accountManager)
    )
  } catch {
    throw new Error('会計管理者の削除に失敗しました')
  }
}
