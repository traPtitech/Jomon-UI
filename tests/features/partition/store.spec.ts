import { createApp } from 'vue'

import { createPinia, setActivePinia } from 'pinia'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PartitionRepositoryKey } from '@/di'
import type { Partition, PartitionSeed } from '@/features/partition/entities'
import { usePartitionStore } from '@/features/partition/store'

describe('Partition Store', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    const pinia = createPinia()
    app = createApp({})
    app.use(pinia)
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  const mockPartition: Partition = {
    id: 'partition-1',
    name: 'Partition 1',
    budget: 1000,
    parentPartitionGroupId: 'group-1',
    management: {
      category: 'manual',
      state: 'available',
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  }

  const mockSeed: PartitionSeed = {
    name: 'New Partition',
    budget: 2000,
    parentPartitionGroupId: 'group-1',
    management: {
      category: 'manual',
      state: 'available',
    },
  }

  const createMockRepository = () => ({
    fetchPartitions: vi.fn(),
    fetchPartition: vi.fn(),
    createPartition: vi.fn(),
    editPartition: vi.fn(),
    deletePartition: vi.fn(),
  })

  describe('actions', () => {
    it('fetchPartitions fetches partitions and updates state', async () => {
      const mockFetchPartitions = vi.fn().mockResolvedValue([mockPartition])
      const mockRepo = {
        ...createMockRepository(),
        fetchPartitions: mockFetchPartitions,
      }
      app.provide(PartitionRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionStore())
      await store.fetchPartitions()

      expect(mockFetchPartitions).toHaveBeenCalled()
      expect(store.partitions.value).toEqual([mockPartition])
      expect(store.status.value).toBe('success')
      expect(store.isPartitionFetched.value).toBe(true)
    })

    it('fetchPartitions handles error', async () => {
      const mockFetchPartitions = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      const mockRepo = {
        ...createMockRepository(),
        fetchPartitions: mockFetchPartitions,
      }
      app.provide(PartitionRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionStore())
      await expect(store.fetchPartitions()).rejects.toThrow(
        'パーティション一覧の取得に失敗しました'
      )
      expect(store.status.value).toBe('error')
      expect(store.error.value).toContain(
        'パーティション一覧の取得に失敗しました'
      )
    })

    it('fetchPartition fetches partition and updates state', async () => {
      const mockFetchPartition = vi.fn().mockResolvedValue(mockPartition)
      const mockRepo = {
        ...createMockRepository(),
        fetchPartition: mockFetchPartition,
      }
      app.provide(PartitionRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionStore())
      await store.fetchPartition('partition-1')

      expect(mockFetchPartition).toHaveBeenCalledWith('partition-1')
      expect(store.currentPartition.value).toEqual(mockPartition)
      expect(store.currentPartition.value).toEqual(mockPartition)
    })

    it('createPartition creates partition and adds to list', async () => {
      const mockCreatePartition = vi.fn().mockResolvedValue(mockPartition)
      const mockRepo = {
        ...createMockRepository(),
        createPartition: mockCreatePartition,
      }
      app.provide(PartitionRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionStore())
      await store.createPartition(mockSeed)

      expect(mockCreatePartition).toHaveBeenCalledWith(mockSeed)
      expect(store.partitions.value[0]).toEqual(mockPartition)
    })

    it('editPartition updates partition and list', async () => {
      const mockUpdatedPartition: Partition = {
        ...mockPartition,
        name: 'Updated Partition',
      }
      const mockEditPartition = vi.fn().mockResolvedValue(mockUpdatedPartition)
      const mockRepo = {
        ...createMockRepository(),
        editPartition: mockEditPartition,
      }
      app.provide(PartitionRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionStore())
      store.currentPartition.value = mockPartition
      store.partitions.value = [mockPartition]

      await store.editPartition('partition-1', mockSeed)

      expect(mockEditPartition).toHaveBeenCalledWith('partition-1', mockSeed)
      expect(store.currentPartition.value).toEqual(mockUpdatedPartition)
      expect(store.partitions.value[0]).toEqual(mockUpdatedPartition)
    })

    it('deletePartition deletes partition and removes from list', async () => {
      const mockDeletePartition = vi.fn().mockResolvedValue(undefined)
      const mockRepo = {
        ...createMockRepository(),
        deletePartition: mockDeletePartition,
      }
      app.provide(PartitionRepositoryKey, mockRepo)

      const store = app.runWithContext(() => usePartitionStore())
      store.partitions.value = [mockPartition]

      await store.deletePartition('partition-1')

      expect(mockDeletePartition).toHaveBeenCalledWith('partition-1')
      expect(store.partitions.value).toEqual([])
    })
  })

  describe('getters', () => {
    it('partitionOptions returns formatted options', () => {
      app.provide(PartitionRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => usePartitionStore())
      store.partitions.value = [mockPartition]

      expect(store.partitionOptions.value).toEqual([
        { label: mockPartition.name, key: mockPartition.id },
      ])
    })
  })
})
