import { createApp } from 'vue'

import { createPinia, setActivePinia } from 'pinia'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { UserRepositoryKey } from '@/di'
import type { User } from '@/features/user/entities'
import { useUserStore } from '@/features/user/store'

describe('User Store', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    const pinia = createPinia()
    app = createApp({})
    app.use(pinia)
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  const mockUser: User = {
    id: 'user-1',
    name: 'test-user',
    displayName: 'Test User',
    accountManager: false,
  }

  const mockAdminUser: User = {
    id: 'admin-1',
    name: 'admin-user',
    displayName: 'Admin User',
    accountManager: true,
  }

  describe('actions', () => {
    it('fetchUsers fetches users and updates state', async () => {
      const mockFetchUsers = vi
        .fn()
        .mockResolvedValue([mockUser, mockAdminUser])
      app.provide(UserRepositoryKey, {
        fetchUsers: mockFetchUsers,
        fetchMe: vi.fn(),
      })

      const store = app.runWithContext(() => useUserStore())
      await store.fetchUsers()

      expect(mockFetchUsers).toHaveBeenCalled()
      expect(store.users.value).toEqual([mockUser, mockAdminUser])
      expect(store.status.value).toBe('success')
      expect(store.isUserFetched.value).toBe(true)
    })

    it('fetchUsers handles error', async () => {
      const mockFetchUsers = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      app.provide(UserRepositoryKey, {
        fetchUsers: mockFetchUsers,
        fetchMe: vi.fn(),
      })

      const store = app.runWithContext(() => useUserStore())
      await expect(store.fetchUsers()).rejects.toThrow(
        'ユーザー一覧の取得に失敗しました'
      )
      expect(store.status.value).toBe('error')
      expect(store.error.value).toContain('ユーザー一覧の取得に失敗しました')
    })

    it('fetchMe fetches current user and updates state', async () => {
      const mockFetchMe = vi.fn().mockResolvedValue(mockUser)
      app.provide(UserRepositoryKey, {
        fetchUsers: vi.fn(),
        fetchMe: mockFetchMe,
      })

      const store = app.runWithContext(() => useUserStore())
      await store.fetchMe()

      expect(mockFetchMe).toHaveBeenCalled()
      expect(store.me.value).toEqual(mockUser)
      expect(store.isMeFetched.value).toBe(true)
    })

    it('fetchMe does not fetch if already fetched', async () => {
      const mockFetchMe = vi.fn().mockResolvedValue(mockUser)
      app.provide(UserRepositoryKey, {
        fetchUsers: vi.fn(),
        fetchMe: mockFetchMe,
      })

      const store = app.runWithContext(() => useUserStore())
      store.isMeFetched.value = true
      await store.fetchMe()

      expect(mockFetchMe).not.toHaveBeenCalled()
    })

    it('fetchMe handles error', async () => {
      const mockFetchMe = vi.fn().mockRejectedValue(new Error('Network error'))
      app.provide(UserRepositoryKey, {
        fetchUsers: vi.fn(),
        fetchMe: mockFetchMe,
      })

      const store = app.runWithContext(() => useUserStore())
      await expect(store.fetchMe()).rejects.toThrow(
        'ユーザーの取得に失敗しました'
      )
    })

    it('reset clears state', () => {
      app.provide(UserRepositoryKey, {
        fetchUsers: vi.fn(),
        fetchMe: vi.fn(),
      })
      const store = app.runWithContext(() => useUserStore())
      store.me.value = mockUser
      store.users.value = [mockUser]
      store.status.value = 'success'
      store.isMeFetched.value = true

      store.reset()

      expect(store.me.value).toBeUndefined()
      expect(store.users.value).toEqual([])
      expect(store.status.value).toBe('idle')
      expect(store.isUserFetched.value).toBe(false)
      expect(store.isMeFetched.value).toBe(false)
    })
  })

  describe('getters', () => {
    it('isAccountManager returns correct value', () => {
      app.provide(UserRepositoryKey, {
        fetchUsers: vi.fn(),
        fetchMe: vi.fn(),
      })
      const store = app.runWithContext(() => useUserStore())

      store.me.value = mockUser
      expect(store.isAccountManager.value).toBe(false)

      store.me.value = mockAdminUser
      expect(store.isAccountManager.value).toBe(true)

      store.me.value = undefined
      expect(store.isAccountManager.value).toBe(false)
    })

    it('userOptions returns formatted options', () => {
      app.provide(UserRepositoryKey, {
        fetchUsers: vi.fn(),
        fetchMe: vi.fn(),
      })
      const store = app.runWithContext(() => useUserStore())
      store.users.value = [mockUser, mockAdminUser]

      expect(store.userOptions.value).toEqual([
        { label: mockUser.name, key: mockUser.id },
        { label: mockAdminUser.name, key: mockAdminUser.id },
      ])
    })

    it('userMap returns id-name map', () => {
      app.provide(UserRepositoryKey, {
        fetchUsers: vi.fn(),
        fetchMe: vi.fn(),
      })
      const store = app.runWithContext(() => useUserStore())
      store.users.value = [mockUser, mockAdminUser]

      expect(store.userMap.value).toEqual({
        [mockUser.id]: mockUser.name,
        [mockAdminUser.id]: mockAdminUser.name,
      })
    })
  })
})
