import { computed, createApp, ref } from 'vue'

import { createPinia, setActivePinia } from 'pinia'

import { DateTime } from 'luxon'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApplicationRepositoryKey } from '@/di'
import type {
  Application,
  ApplicationDetail,
  ApplicationSeed,
} from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationComment } from '@/features/applicationComment/entities'
import type { ApplicationStatusDetail } from '@/features/applicationStatus/entities'
import { useTagStore } from '@/features/tag/store'

// Mock tag store
vi.mock('@/features/tag/store', () => ({
  useTagStore: vi.fn(),
}))

describe('Application Store', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    const pinia = createPinia()
    app = createApp({})
    app.use(pinia)
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  const mockApplication: Application = {
    id: 'app-1',
    status: 'pending_review',
    createdBy: 'user-1',
    title: 'Test App',
    content: 'Test Content',
    targets: [],
    tags: [],
    partition: {
      id: 'part-1',
      name: 'Partition 1',
      budget: 1000,
      parentPartitionGroupId: 'group-1',
      management: { category: 'manual', state: 'available' },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    createdAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
    updatedAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
  }

  const mockApplicationDetail: ApplicationDetail = {
    ...mockApplication,
    files: [],
    comments: [],
    statuses: [],
  }

  const mockSeed: ApplicationSeed = {
    createdBy: 'user-1',
    title: 'New App',
    content: 'New Content',
    tags: [],
    partition: 'part-1',
    targets: [],
  }

  const createMockRepository = () => ({
    fetchApplications: vi.fn(),
    fetchApplication: vi.fn(),
    createApplication: vi.fn(),
    editApplication: vi.fn(),
    createComment: vi.fn(),
    editStatus: vi.fn(),
  })

  describe('actions', () => {
    it('fetchApplications fetches applications and updates state', async () => {
      const mockFetchApplications = vi.fn().mockResolvedValue([mockApplication])
      const mockRepo = {
        ...createMockRepository(),
        fetchApplications: mockFetchApplications,
      }
      app.provide(ApplicationRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useApplicationStore())
      await store.fetchApplications()

      expect(mockFetchApplications).toHaveBeenCalled()
      expect(store.applications.value).toEqual([mockApplication])
      expect(store.status.value).toBe('success')
      expect(store.isApplicationFetched.value).toBe(true)
    })

    it('fetchApplications handles error', async () => {
      const mockFetchApplications = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      const mockRepo = {
        ...createMockRepository(),
        fetchApplications: mockFetchApplications,
      }
      app.provide(ApplicationRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useApplicationStore())
      await expect(store.fetchApplications()).rejects.toThrow(
        '申請一覧の取得に失敗しました'
      )
      expect(store.status.value).toBe('error')
      expect(store.error.value).toContain('申請一覧の取得に失敗しました')
    })

    it('fetchApplication fetches application detail and updates state', async () => {
      const mockFetchApplication = vi
        .fn()
        .mockResolvedValue(mockApplicationDetail)
      const mockRepo = {
        ...createMockRepository(),
        fetchApplication: mockFetchApplication,
      }
      app.provide(ApplicationRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useApplicationStore())
      await store.fetchApplication('app-1')

      expect(mockFetchApplication).toHaveBeenCalledWith('app-1')
      expect(store.currentApplication.value).toEqual(mockApplicationDetail)
    })

    it('createApplication creates application and adds to list', async () => {
      const mockCreateApplication = vi
        .fn()
        .mockResolvedValue(mockApplicationDetail)
      const mockRepo = {
        ...createMockRepository(),
        createApplication: mockCreateApplication,
      }
      app.provide(ApplicationRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useApplicationStore())
      await store.createApplication(mockSeed)

      expect(mockCreateApplication).toHaveBeenCalledWith(mockSeed)
      expect(store.applications.value[0]).toEqual(mockApplicationDetail)
    })

    it('editApplication updates application and list', async () => {
      const mockUpdatedApp: ApplicationDetail = {
        ...mockApplicationDetail,
        title: 'Updated Title',
      }
      const mockEditApplication = vi.fn().mockResolvedValue(mockUpdatedApp)
      const mockRepo = {
        ...createMockRepository(),
        editApplication: mockEditApplication,
      }
      app.provide(ApplicationRepositoryKey, mockRepo)

      vi.mocked(useTagStore).mockReturnValue({
        tags: ref([]),
        status: ref('success'),
        error: ref(null),
        fetchTags: vi.fn(),
        reset: vi.fn(),
        isTagFetched: computed(() => true),
        tagOptions: computed(() => []),
        createTag: vi.fn(),
        deleteTags: vi.fn(),
      })

      const store = app.runWithContext(() => useApplicationStore())
      store.currentApplication.value = mockApplicationDetail
      store.applications.value = [mockApplication]

      await store.editApplication('app-1', mockSeed)

      expect(mockEditApplication).toHaveBeenCalled()
      expect(store.currentApplication.value).toEqual(mockUpdatedApp)
      expect(store.applications.value[0]).toEqual(mockUpdatedApp)
    })

    it('createComment adds comment to current application', async () => {
      const mockComment: ApplicationComment = {
        id: 'comment-1',
        comment: 'Test Comment',
        user: 'user-1',
        createdAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
        updatedAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
      }
      const mockCreateComment = vi.fn().mockResolvedValue(mockComment)
      const mockRepo = {
        ...createMockRepository(),
        createComment: mockCreateComment,
      }
      app.provide(ApplicationRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useApplicationStore())
      store.currentApplication.value = mockApplicationDetail

      await store.createComment('app-1', 'Test Comment')

      expect(mockCreateComment).toHaveBeenCalledWith('app-1', 'Test Comment')
      expect(store.currentApplication.value.comments).toContainEqual(
        mockComment
      )
    })

    it('changeStatus updates status and adds status log', async () => {
      const mockStatusDetail: ApplicationStatusDetail = {
        status: 'approved',
        createdBy: 'user-1',
        createdAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
      }
      const mockEditStatus = vi.fn().mockResolvedValue(mockStatusDetail)
      const mockRepo = {
        ...createMockRepository(),
        editStatus: mockEditStatus,
      }
      app.provide(ApplicationRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useApplicationStore())
      store.currentApplication.value = mockApplicationDetail
      store.applications.value = [mockApplication]

      await store.changeStatus('app-1', 'approved', 'Approved')

      expect(mockEditStatus).toHaveBeenCalledWith(
        'app-1',
        'approved',
        'Approved'
      )
      expect(store.currentApplication.value.status).toBe('approved')
      expect(store.currentApplication.value.statuses).toContainEqual(
        mockStatusDetail
      )
      expect(store.applications.value[0]?.status).toBe('approved')
    })
  })

  describe('getters', () => {
    it('hasApplicationDetail returns correct value', () => {
      app.provide(ApplicationRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => useApplicationStore())

      store.currentApplication.value = null
      expect(store.hasApplicationDetail.value).toBe(false)

      store.currentApplication.value = mockApplicationDetail
      expect(store.hasApplicationDetail.value).toBe(true)
    })
  })
})
