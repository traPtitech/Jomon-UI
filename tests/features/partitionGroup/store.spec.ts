import { createApp } from 'vue'

import { createPinia, setActivePinia } from 'pinia'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PartitionGroupRepositoryKey } from '@/di'
import type {
  PartitionGroup,
  PartitionGroupSeed,
} from '@/features/partitionGroup/entities'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import type { User } from '@/features/user/entities'

describe('PartitionGroup Store', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    const pinia = createPinia()
    app = createApp({})
    app.use(pinia)
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  const mockPartitionGroup: PartitionGroup = {
    id: 'group-1',
    name: 'Group 1',
    parentPartitionGroupId: null,
    depth: 0,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  }

  const mockSeed: PartitionGroupSeed = {
    name: 'New Group',
    parentPartitionGroupId: null,
    depth: 0,
  }

  const createMockRepository = () => ({
    fetchPartitionGroups: vi.fn(),
    fetchPartitionGroup: vi.fn(),
    createPartitionGroup: vi.fn(),
    editPartitionGroup: vi.fn(),
    deletePartitionGroup: vi.fn(),
  })

  describe('actions', () => {
    it('fetchPartitionGroups fetches groups and updates state', async () => {
      const mockFetchPartitionGroups = vi
        .fn()
        .mockResolvedValue([mockPartitionGroup])
      const mockRepo = {
        ...createMockRepository(),
        fetchPartitionGroups: mockFetchPartitionGroups,
      }
      app.provide(PartitionGroupRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionGroupStore())
      await store.fetchPartitionGroups()

      expect(mockFetchPartitionGroups).toHaveBeenCalled()
      expect(store.partitionGroups.value).toEqual([mockPartitionGroup])
      expect(store.status.value).toBe('success')
      expect(store.isPartitionGroupFetched.value).toBe(true)
    })

    it('fetchPartitionGroups handles error', async () => {
      const mockFetchPartitionGroups = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      const mockRepo = {
        ...createMockRepository(),
        fetchPartitionGroups: mockFetchPartitionGroups,
      }
      app.provide(PartitionGroupRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionGroupStore())
      await expect(store.fetchPartitionGroups()).rejects.toThrow(
        'パーティショングループ一覧の取得に失敗しました'
      )
      expect(store.status.value).toBe('error')
      expect(store.error.value).toContain(
        'パーティショングループ一覧の取得に失敗しました'
      )
    })

    it('fetchPartitionGroup fetches group and updates state', async () => {
      const mockFetchPartitionGroup = vi
        .fn()
        .mockResolvedValue(mockPartitionGroup)
      const mockRepo = {
        ...createMockRepository(),
        fetchPartitionGroup: mockFetchPartitionGroup,
      }
      app.provide(PartitionGroupRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionGroupStore())
      await store.fetchPartitionGroup('group-1')

      expect(mockFetchPartitionGroup).toHaveBeenCalledWith('group-1')
      expect(store.currentPartitionGroup.value).toEqual(mockPartitionGroup)
      expect(store.editedValue.value).toEqual({
        name: mockPartitionGroup.name,
        parentPartitionGroupId: mockPartitionGroup.parentPartitionGroupId,
        depth: mockPartitionGroup.depth,
      })
    })

    it('createPartitionGroup creates group and adds to list', async () => {
      const mockCreatePartitionGroup = vi
        .fn()
        .mockResolvedValue(mockPartitionGroup)
      const mockRepo = {
        ...createMockRepository(),
        createPartitionGroup: mockCreatePartitionGroup,
      }
      app.provide(PartitionGroupRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionGroupStore())
      await store.createPartitionGroup(mockSeed)

      expect(mockCreatePartitionGroup).toHaveBeenCalledWith(mockSeed)
      expect(store.partitionGroups.value[0]).toEqual(mockPartitionGroup)
    })

    it('editPartitionGroup updates group and list', async () => {
      const mockUpdatedGroup: PartitionGroup = {
        ...mockPartitionGroup,
        name: 'Updated Group',
      }
      const mockEditPartitionGroup = vi.fn().mockResolvedValue(mockUpdatedGroup)
      const mockRepo = {
        ...createMockRepository(),
        editPartitionGroup: mockEditPartitionGroup,
      }
      app.provide(PartitionGroupRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionGroupStore())
      store.currentPartitionGroup.value = mockPartitionGroup
      store.partitionGroups.value = [mockPartitionGroup]

      await store.editPartitionGroup('group-1', mockSeed)

      expect(mockEditPartitionGroup).toHaveBeenCalledWith('group-1', mockSeed)
      expect(store.currentPartitionGroup.value).toEqual(mockUpdatedGroup)
      expect(store.partitionGroups.value[0]).toEqual(mockUpdatedGroup)
    })

    it('deletePartitionGroup deletes group and removes from list', async () => {
      const mockDeletePartitionGroup = vi.fn().mockResolvedValue(undefined)
      const mockRepo = {
        ...createMockRepository(),
        deletePartitionGroup: mockDeletePartitionGroup,
      }
      app.provide(PartitionGroupRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionGroupStore())
      store.partitionGroups.value = [mockPartitionGroup]

      await store.deletePartitionGroup('group-1')

      expect(mockDeletePartitionGroup).toHaveBeenCalledWith('group-1')
      expect(store.partitionGroups.value).toEqual([])
    })
  })

  describe('getters', () => {
    it('partitionGroupOptions returns formatted options', () => {
      app.provide(PartitionGroupRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => usePartitionGroupStore())
      store.partitionGroups.value = [mockPartitionGroup]

      expect(store.partitionGroupOptions.value).toEqual([
        { key: mockPartitionGroup.name, value: mockPartitionGroup.id },
      ])
    })

    it('canEditPartitionGroup returns correct value', () => {
      app.provide(PartitionGroupRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => usePartitionGroupStore())
      const canEdit = store.canEditPartitionGroup.value

      expect(canEdit(undefined)).toBe(false)
      expect(canEdit({ accountManager: false } as User)).toBe(false)
      expect(canEdit({ accountManager: true } as User)).toBe(true)
    })

    it('partitionGroupIdNameToMap returns id-name map', () => {
      app.provide(PartitionGroupRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => usePartitionGroupStore())
      store.partitionGroups.value = [mockPartitionGroup]

      const map = store.partitionGroupIdNameToMap.value
      expect(map.get(mockPartitionGroup.id)).toBe(mockPartitionGroup.name)
    })
  })
})
