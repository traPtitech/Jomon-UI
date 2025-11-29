import { usePartitionGroupRepository } from '@/features/partitionGroup/data/repository'
import type {
  PartitionGroup,
  PartitionGroupSeed
} from '@/features/partitionGroup/entities'
import { usePartitionGroupStore } from '@/features/partitionGroup/store'
import type { User } from '@/features/user/entities'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock repository
vi.mock('@/features/partitionGroup/data/repository', () => ({
  usePartitionGroupRepository: vi.fn()
}))

describe('PartitionGroup Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockPartitionGroup: PartitionGroup = {
    id: 'group-1',
    name: 'Group 1',
    parentPartitionGroupId: null,
    depth: 0,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }

  const mockSeed: PartitionGroupSeed = {
    name: 'New Group',
    parentPartitionGroupId: null,
    depth: 0
  }

  describe('actions', () => {
    it('fetchPartitionGroups fetches groups and updates state', async () => {
      const mockFetchPartitionGroups = vi
        .fn()
        .mockResolvedValue([mockPartitionGroup])
      vi.mocked(usePartitionGroupRepository).mockReturnValue({
        fetchPartitionGroups: mockFetchPartitionGroups,
        fetchPartitionGroup: vi.fn(),
        createPartitionGroup: vi.fn(),
        editPartitionGroup: vi.fn(),
        deletePartitionGroup: vi.fn()
      })

      const store = usePartitionGroupStore()
      await store.fetchPartitionGroups()

      expect(mockFetchPartitionGroups).toHaveBeenCalled()
      expect(store.partitionGroups.value).toEqual([mockPartitionGroup])
      expect(store.isPartitionGroupFetched.value).toBe(true)
    })

    it('fetchPartitionGroups handles error', async () => {
      const mockFetchPartitionGroups = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      vi.mocked(usePartitionGroupRepository).mockReturnValue({
        fetchPartitionGroups: mockFetchPartitionGroups,
        fetchPartitionGroup: vi.fn(),
        createPartitionGroup: vi.fn(),
        editPartitionGroup: vi.fn(),
        deletePartitionGroup: vi.fn()
      })

      const store = usePartitionGroupStore()
      await expect(store.fetchPartitionGroups()).rejects.toThrow(
        'パーティショングループ一覧の取得に失敗しました'
      )
    })

    it('fetchPartitionGroup fetches group and updates state', async () => {
      const mockFetchPartitionGroup = vi
        .fn()
        .mockResolvedValue(mockPartitionGroup)
      vi.mocked(usePartitionGroupRepository).mockReturnValue({
        fetchPartitionGroups: vi.fn(),
        fetchPartitionGroup: mockFetchPartitionGroup,
        createPartitionGroup: vi.fn(),
        editPartitionGroup: vi.fn(),
        deletePartitionGroup: vi.fn()
      })

      const store = usePartitionGroupStore()
      await store.fetchPartitionGroup('group-1')

      expect(mockFetchPartitionGroup).toHaveBeenCalledWith('group-1')
      expect(store.currentPartitionGroup.value).toEqual(mockPartitionGroup)
      expect(store.editedValue.value).toEqual({
        name: mockPartitionGroup.name,
        parentPartitionGroupId: mockPartitionGroup.parentPartitionGroupId,
        depth: mockPartitionGroup.depth
      })
    })

    it('createPartitionGroup creates group and adds to list', async () => {
      const mockCreatePartitionGroup = vi
        .fn()
        .mockResolvedValue(mockPartitionGroup)
      vi.mocked(usePartitionGroupRepository).mockReturnValue({
        fetchPartitionGroups: vi.fn(),
        fetchPartitionGroup: vi.fn(),
        createPartitionGroup: mockCreatePartitionGroup,
        editPartitionGroup: vi.fn(),
        deletePartitionGroup: vi.fn()
      })

      const store = usePartitionGroupStore()
      await store.createPartitionGroup(mockSeed)

      expect(mockCreatePartitionGroup).toHaveBeenCalledWith(mockSeed)
      expect(store.partitionGroups.value[0]).toEqual(mockPartitionGroup)
    })

    it('editPartitionGroup updates group and list', async () => {
      const mockUpdatedGroup: PartitionGroup = {
        ...mockPartitionGroup,
        name: 'Updated Group'
      }
      const mockEditPartitionGroup = vi.fn().mockResolvedValue(mockUpdatedGroup)
      vi.mocked(usePartitionGroupRepository).mockReturnValue({
        fetchPartitionGroups: vi.fn(),
        fetchPartitionGroup: vi.fn(),
        createPartitionGroup: vi.fn(),
        editPartitionGroup: mockEditPartitionGroup,
        deletePartitionGroup: vi.fn()
      })

      const store = usePartitionGroupStore()
      store.currentPartitionGroup.value = mockPartitionGroup
      store.partitionGroups.value = [mockPartitionGroup]

      await store.editPartitionGroup('group-1', mockSeed)

      expect(mockEditPartitionGroup).toHaveBeenCalledWith('group-1', mockSeed)
      expect(store.currentPartitionGroup.value).toEqual(mockUpdatedGroup)
      expect(store.partitionGroups.value[0]).toEqual(mockUpdatedGroup)
    })

    it('deletePartitionGroup deletes group and removes from list', async () => {
      const mockDeletePartitionGroup = vi.fn().mockResolvedValue(undefined)
      vi.mocked(usePartitionGroupRepository).mockReturnValue({
        fetchPartitionGroups: vi.fn(),
        fetchPartitionGroup: vi.fn(),
        createPartitionGroup: vi.fn(),
        editPartitionGroup: vi.fn(),
        deletePartitionGroup: mockDeletePartitionGroup
      })

      const store = usePartitionGroupStore()
      store.partitionGroups.value = [mockPartitionGroup]

      await store.deletePartitionGroup('group-1')

      expect(mockDeletePartitionGroup).toHaveBeenCalledWith('group-1')
      expect(store.partitionGroups.value).toEqual([])
    })
  })

  describe('getters', () => {
    it('partitionGroupOptions returns formatted options', () => {
      const store = usePartitionGroupStore()
      store.partitionGroups.value = [mockPartitionGroup]

      expect(store.partitionGroupOptions.value).toEqual([
        { key: mockPartitionGroup.name, value: mockPartitionGroup.id }
      ])
    })

    it('canEditPartitionGroup returns correct value', () => {
      const store = usePartitionGroupStore()
      const canEdit = store.canEditPartitionGroup.value

      expect(canEdit(undefined)).toBe(false)
      expect(canEdit({ accountManager: false } as User)).toBe(false)
      expect(canEdit({ accountManager: true } as User)).toBe(true)
    })

    it('partitionGroupIdNameToMap returns id-name map', () => {
      const store = usePartitionGroupStore()
      store.partitionGroups.value = [mockPartitionGroup]

      const map = store.partitionGroupIdNameToMap.value
      expect(map.get(mockPartitionGroup.id)).toBe(mockPartitionGroup.name)
    })
  })
})
