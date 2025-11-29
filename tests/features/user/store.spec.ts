import { useUserRepository } from '@/features/user/data/repository'
import type { User } from '@/features/user/entities'
import { useUserStore } from '@/features/user/store'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock repository
vi.mock('@/features/user/data/repository', () => ({
  useUserRepository: vi.fn()
}))

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockUser: User = {
    id: 'user-1',
    name: 'test-user',
    displayName: 'Test User',
    accountManager: false
  }

  const mockAdminUser: User = {
    id: 'admin-1',
    name: 'admin-user',
    displayName: 'Admin User',
    accountManager: true
  }

  describe('actions', () => {
    it('fetchUsers fetches users and updates state', async () => {
      const mockFetchUsers = vi
        .fn()
        .mockResolvedValue([mockUser, mockAdminUser])
      vi.mocked(useUserRepository).mockReturnValue({
        fetchUsers: mockFetchUsers,
        fetchMe: vi.fn()
      })

      const store = useUserStore()
      await store.fetchUsers()

      expect(mockFetchUsers).toHaveBeenCalled()
      expect(store.users.value).toEqual([mockUser, mockAdminUser])
      expect(store.isUserFetched.value).toBe(true)
    })

    it('fetchUsers handles error', async () => {
      const mockFetchUsers = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      vi.mocked(useUserRepository).mockReturnValue({
        fetchUsers: mockFetchUsers,
        fetchMe: vi.fn()
      })

      const store = useUserStore()
      await expect(store.fetchUsers()).rejects.toThrow(
        'ユーザー一覧の取得に失敗しました'
      )
    })

    it('fetchMe fetches current user and updates state', async () => {
      const mockFetchMe = vi.fn().mockResolvedValue(mockUser)
      vi.mocked(useUserRepository).mockReturnValue({
        fetchUsers: vi.fn(),
        fetchMe: mockFetchMe
      })

      const store = useUserStore()
      await store.fetchMe()

      expect(mockFetchMe).toHaveBeenCalled()
      expect(store.me.value).toEqual(mockUser)
      expect(store.isMeFetched.value).toBe(true)
    })

    it('fetchMe does not fetch if already fetched', async () => {
      const mockFetchMe = vi.fn().mockResolvedValue(mockUser)
      vi.mocked(useUserRepository).mockReturnValue({
        fetchUsers: vi.fn(),
        fetchMe: mockFetchMe
      })

      const store = useUserStore()
      store.isMeFetched.value = true
      await store.fetchMe()

      expect(mockFetchMe).not.toHaveBeenCalled()
    })

    it('fetchMe handles error', async () => {
      const mockFetchMe = vi.fn().mockRejectedValue(new Error('Network error'))
      vi.mocked(useUserRepository).mockReturnValue({
        fetchUsers: vi.fn(),
        fetchMe: mockFetchMe
      })

      const store = useUserStore()
      await expect(store.fetchMe()).rejects.toThrow(
        'ユーザーの取得に失敗しました'
      )
    })

    it('reset clears state', () => {
      const store = useUserStore()
      store.me.value = mockUser
      store.users.value = [mockUser]
      store.isUserFetched.value = true
      store.isMeFetched.value = true

      store.reset()

      expect(store.me.value).toBeUndefined()
      expect(store.users.value).toEqual([])
      expect(store.isUserFetched.value).toBe(false)
      expect(store.isMeFetched.value).toBe(false)
    })
  })

  describe('getters', () => {
    it('isAccountManager returns correct value', () => {
      const store = useUserStore()

      store.me.value = mockUser
      expect(store.isAccountManager.value).toBe(false)

      store.me.value = mockAdminUser
      expect(store.isAccountManager.value).toBe(true)

      store.me.value = undefined
      expect(store.isAccountManager.value).toBe(false)
    })

    it('userOptions returns formatted options', () => {
      const store = useUserStore()
      store.users.value = [mockUser, mockAdminUser]

      expect(store.userOptions.value).toEqual([
        { key: mockUser.name, value: mockUser.id },
        { key: mockAdminUser.name, value: mockAdminUser.id }
      ])
    })

    it('userMap returns id-name map', () => {
      const store = useUserStore()
      store.users.value = [mockUser, mockAdminUser]

      expect(store.userMap.value).toEqual({
        [mockUser.id]: mockUser.name,
        [mockAdminUser.id]: mockAdminUser.name
      })
    })
  })
})
