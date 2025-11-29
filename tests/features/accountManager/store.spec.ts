import { AccountManagerRepositoryKey } from '@/di'
import { useAccountManagerStore } from '@/features/accountManager/store'
import { useUserStore } from '@/features/user/store'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, createApp } from 'vue'

// Mock user store
vi.mock('@/features/user/store', () => ({
  useUserStore: vi.fn()
}))

describe('AccountManager Store', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    const pinia = createPinia()
    app = createApp({})
    app.use(pinia)
    setActivePinia(pinia)
    vi.clearAllMocks()

    // Default mock for useUserStore to prevent crash during store initialization
    vi.mocked(useUserStore).mockReturnValue({
      userMap: computed(() => ({}))
    } as unknown as ReturnType<typeof useUserStore>)
  })

  const mockAccountManagers = ['user-1', 'user-2']

  const createMockRepository = () => ({
    fetchAccountManagers: vi.fn(),
    addAccountManagers: vi.fn(),
    removeAccountManagers: vi.fn()
  })

  describe('actions', () => {
    it('fetchAccountManagers fetches managers and updates state', async () => {
      const mockFetchAccountManagers = vi
        .fn()
        .mockResolvedValue(mockAccountManagers)
      const mockRepo = {
        ...createMockRepository(),
        fetchAccountManagers: mockFetchAccountManagers
      }
      app.provide(AccountManagerRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useAccountManagerStore())
      await store.fetchAccountManagers()

      expect(mockFetchAccountManagers).toHaveBeenCalled()
      expect(store.accountManagers.value).toEqual(mockAccountManagers)
      expect(store.status.value).toBe('success')
      expect(store.isAccountManagerFetched.value).toBe(true)
    })

    it('fetchAccountManagers handles error', async () => {
      const mockFetchAccountManagers = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      const mockRepo = {
        ...createMockRepository(),
        fetchAccountManagers: mockFetchAccountManagers
      }
      app.provide(AccountManagerRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useAccountManagerStore())
      await expect(store.fetchAccountManagers()).rejects.toThrow(
        '会計管理者の取得に失敗しました'
      )
      expect(store.status.value).toBe('error')
      expect(store.error.value).toContain('会計管理者の取得に失敗しました')
    })

    it('addAccountManagers adds managers and updates state', async () => {
      const mockAddAccountManagers = vi.fn().mockResolvedValue(undefined)
      const mockRepo = {
        ...createMockRepository(),
        addAccountManagers: mockAddAccountManagers
      }
      app.provide(AccountManagerRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useAccountManagerStore())
      store.accountManagers.value = ['user-1']

      await store.addAccountManagers(['user-2'])

      expect(mockAddAccountManagers).toHaveBeenCalledWith(['user-2'])
      expect(store.accountManagers.value).toEqual(['user-1', 'user-2'])
    })

    it('removeAccountManagers removes managers and updates state', async () => {
      const mockRemoveAccountManagers = vi.fn().mockResolvedValue(undefined)
      const mockRepo = {
        ...createMockRepository(),
        removeAccountManagers: mockRemoveAccountManagers
      }
      app.provide(AccountManagerRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useAccountManagerStore())
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

      app.provide(AccountManagerRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => useAccountManagerStore())
      store.accountManagers.value = ['user-1', 'user-2']

      expect(store.accountManagerOptions.value).toEqual([
        { key: 'User 1', value: 'user-1' },
        { key: 'User 2', value: 'user-2' }
      ])
    })
  })
})
