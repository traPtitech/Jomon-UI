import { usePartitionRepository } from '@/features/partition/data/repository'
import type { Partition, PartitionSeed } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock repository
vi.mock('@/features/partition/data/repository', () => ({
  usePartitionRepository: vi.fn()
}))

describe('Partition Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockPartition: Partition = {
    id: 'partition-1',
    name: 'Partition 1',
    budget: 1000,
    parentPartitionGroupId: 'group-1',
    management: {
      category: 'manual',
      state: 'available'
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }

  const mockSeed: PartitionSeed = {
    name: 'New Partition',
    budget: 2000,
    parentPartitionGroupId: 'group-1',
    management: {
      category: 'manual',
      state: 'available'
    }
  }

  describe('actions', () => {
    it('fetchPartitions fetches partitions and updates state', async () => {
      const mockFetchPartitions = vi.fn().mockResolvedValue([mockPartition])
      vi.mocked(usePartitionRepository).mockReturnValue({
        fetchPartitions: mockFetchPartitions,
        fetchPartition: vi.fn(),
        createPartition: vi.fn(),
        editPartition: vi.fn(),
        deletePartition: vi.fn()
      })

      const store = usePartitionStore()
      await store.fetchPartitions()

      expect(mockFetchPartitions).toHaveBeenCalled()
      expect(store.partitions.value).toEqual([mockPartition])
      expect(store.isPartitionFetched.value).toBe(true)
    })

    it('fetchPartitions handles error', async () => {
      const mockFetchPartitions = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      vi.mocked(usePartitionRepository).mockReturnValue({
        fetchPartitions: mockFetchPartitions,
        fetchPartition: vi.fn(),
        createPartition: vi.fn(),
        editPartition: vi.fn(),
        deletePartition: vi.fn()
      })

      const store = usePartitionStore()
      await expect(store.fetchPartitions()).rejects.toThrow(
        'パーティション一覧の取得に失敗しました'
      )
    })

    it('fetchPartition fetches partition and updates state', async () => {
      const mockFetchPartition = vi.fn().mockResolvedValue(mockPartition)
      vi.mocked(usePartitionRepository).mockReturnValue({
        fetchPartitions: vi.fn(),
        fetchPartition: mockFetchPartition,
        createPartition: vi.fn(),
        editPartition: vi.fn(),
        deletePartition: vi.fn()
      })

      const store = usePartitionStore()
      await store.fetchPartition('partition-1')

      expect(mockFetchPartition).toHaveBeenCalledWith('partition-1')
      expect(store.currentPartition.value).toEqual(mockPartition)
      expect(store.editedValue.value).toEqual({
        name: mockPartition.name,
        budget: mockPartition.budget,
        parentPartitionGroupId: mockPartition.parentPartitionGroupId,
        management: mockPartition.management
      })
    })

    it('createPartition creates partition and adds to list', async () => {
      const mockCreatePartition = vi.fn().mockResolvedValue(mockPartition)
      vi.mocked(usePartitionRepository).mockReturnValue({
        fetchPartitions: vi.fn(),
        fetchPartition: vi.fn(),
        createPartition: mockCreatePartition,
        editPartition: vi.fn(),
        deletePartition: vi.fn()
      })

      const store = usePartitionStore()
      await store.createPartition(mockSeed)

      expect(mockCreatePartition).toHaveBeenCalledWith(mockSeed)
      expect(store.partitions.value[0]).toEqual(mockPartition)
    })

    it('editPartition updates partition and list', async () => {
      const mockUpdatedPartition: Partition = {
        ...mockPartition,
        name: 'Updated Partition'
      }
      const mockEditPartition = vi.fn().mockResolvedValue(mockUpdatedPartition)
      vi.mocked(usePartitionRepository).mockReturnValue({
        fetchPartitions: vi.fn(),
        fetchPartition: vi.fn(),
        createPartition: vi.fn(),
        editPartition: mockEditPartition,
        deletePartition: vi.fn()
      })

      const store = usePartitionStore()
      store.currentPartition.value = mockPartition
      store.partitions.value = [mockPartition]

      await store.editPartition('partition-1', mockSeed)

      expect(mockEditPartition).toHaveBeenCalledWith('partition-1', mockSeed)
      expect(store.currentPartition.value).toEqual(mockUpdatedPartition)
      expect(store.partitions.value[0]).toEqual(mockUpdatedPartition)
    })

    it('deletePartition deletes partition and removes from list', async () => {
      const mockDeletePartition = vi.fn().mockResolvedValue(undefined)
      vi.mocked(usePartitionRepository).mockReturnValue({
        fetchPartitions: vi.fn(),
        fetchPartition: vi.fn(),
        createPartition: vi.fn(),
        editPartition: vi.fn(),
        deletePartition: mockDeletePartition
      })

      const store = usePartitionStore()
      store.partitions.value = [mockPartition]

      await store.deletePartition('partition-1')

      expect(mockDeletePartition).toHaveBeenCalledWith('partition-1')
      expect(store.partitions.value).toEqual([])
    })
  })

  describe('getters', () => {
    it('partitionOptions returns formatted options', () => {
      const store = usePartitionStore()
      store.partitions.value = [mockPartition]

      expect(store.partitionOptions.value).toEqual([
        { key: mockPartition.name, value: mockPartition.id }
      ])
    })
  })
})
