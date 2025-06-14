import apis from '/@/lib/apis'

export const useAdminRepository = () => {
  return createAdminRepository()
}

const createAdminRepository = () => ({
  fetchAdmins: async () => {
    const { data } = await apis.getAccountManagers()
    return data
  },
  addAdmins: async (admins: string[]): Promise<string[]> => {
    await apis.postAccountManagers(admins)
    return admins //TODO: レスポンスほしい
  },
  removeAdmins: async (admins: string[]) => {
    await apis.deleteAccountManagers(admins)
  }
})
