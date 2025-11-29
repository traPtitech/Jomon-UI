import { useAccountManagerRepository } from '@/features/accountManager/data/repository'
import { useAccountManagerStore } from '@/features/accountManager/store'
import { useUserStore } from '@/features/user/store'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed } from 'vue'

// Mock repository
vi.mock('@/features/accountManager/data/repository', () => ({
  useAccountManagerRepository: vi.fn()
}))

// Mock user store
vi.mock('@/features/user/store', () => ({
  useUserStore: vi.fn()
}))

describe('AccountManager Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockAccountManagers = ['user-1', 'user-2']

  describe('actions', () => {
    it('fetchAccountManagers fetches managers and updates state', async () => {
      const mockFetchAccountManagers = vi
        .fn()
        .mockResolvedValue(mockAccountManagers)
      vi.mocked(useAccountManagerRepository).mockReturnValue({
        fetchAccountManagers: mockFetchAccountManagers,
        addAccountManagers: vi.fn(),
        removeAccountManagers: vi.fn()
      })

      const store = useAccountManagerStore()
      await store.fetchAccountManagers()

      expect(mockFetchAccountManagers).toHaveBeenCalled()
      expect(store.accountManagers.value).toEqual(mockAccountManagers)
      expect(store.isAccountManagerFetched.value).toBe(true)
    })

    it('fetchAccountManagers handles error', async () => {
      const mockFetchAccountManagers = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      vi.mocked(useAccountManagerRepository).mockReturnValue({
        fetchAccountManagers: mockFetchAccountManagers,
        addAccountManagers: vi.fn(),
        removeAccountManagers: vi.fn()
      })

      const store = useAccountManagerStore()
      await expect(store.fetchAccountManagers()).rejects.toThrow(
        '会計管理者の取得に失敗しました'
      )
    })

    it('addAccountManagers adds managers and updates state', async () => {
      const mockAddAccountManagers = vi.fn().mockResolvedValue(undefined)
      vi.mocked(useAccountManagerRepository).mockReturnValue({
        fetchAccountManagers: vi.fn(),
        addAccountManagers: mockAddAccountManagers,
        removeAccountManagers: vi.fn()
      })

      const store = useAccountManagerStore()
      store.accountManagers.value = ['user-1']

      await store.addAccountManagers(['user-2'])

      expect(mockAddAccountManagers).toHaveBeenCalledWith(['user-2'])
      expect(store.accountManagers.value).toEqual(['user-1', 'user-2'])
    })

    it('removeAccountManagers removes managers and updates state', async () => {
      const mockRemoveAccountManagers = vi.fn().mockResolvedValue(undefined)
      vi.mocked(useAccountManagerRepository).mockReturnValue({
        fetchAccountManagers: vi.fn(),
        addAccountManagers: vi.fn(),
        removeAccountManagers: mockRemoveAccountManagers
      })

      const store = useAccountManagerStore()
      store.accountManagers.value = ['user-1', 'user-2']

      await store.removeAccountManagers(['user-1'])

      expect(mockRemoveAccountManagers).toHaveBeenCalledWith(['user-1'])
      expect(store.accountManagers.value).toEqual(['user-2'])
    })
  })

  describe('getters', () => {
    it('accountManagerOptions returns formatted options', () => {
      const mockUserMap = {
        'user-1': 'User 1',
        'user-2': 'User 2'
      }

      vi.mocked(useUserStore).mockReturnValue({
        userMap: computed(() => mockUserMap)
      } as unknown as ReturnType<typeof useUserStore>)

      const store = useAccountManagerStore()
      store.accountManagers.value = ['user-1', 'user-2']

      expect(store.accountManagerOptions.value).toEqual([
        { key: 'User 1', value: 'user-1' },
        { key: 'User 2', value: 'user-2' }
      ])
    })
  })
})
