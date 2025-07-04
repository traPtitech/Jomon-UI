import apis from '/@/lib/apis'

export const useAccountManagerRepository = () => {
  return createAccountManagerRepository()
}

const createAccountManagerRepository = () => ({
  fetchAccountManagers: async () => {
    const { data } = await apis.getAccountManagers()
    return data
  },
  addAccountManagers: async (accountManagers: string[]): Promise<string[]> => {
    await apis.postAccountManagers(accountManagers)
    return accountManagers //TODO: レスポンスほしい
  },
  removeAccountManagers: async (accountManagers: string[]) => {
    await apis.deleteAccountManagers(accountManagers)
  }
})
