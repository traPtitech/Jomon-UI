import { useApplicationRepository } from '@/features/application/data/repository'
import type {
  Application,
  ApplicationDetail,
  ApplicationSeed
} from '@/features/application/entities'
import { useApplicationStore } from '@/features/application/store'
import type { ApplicationComment } from '@/features/applicationComment/entities'
import type { ApplicationStatusDetail } from '@/features/applicationStatus/entities'
import { useTagStore } from '@/features/tag/store'
import { DateTime } from 'luxon'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock repository
vi.mock('@/features/application/data/repository', () => ({
  useApplicationRepository: vi.fn()
}))

// Mock tag store
vi.mock('@/features/tag/store', () => ({
  useTagStore: vi.fn()
}))

describe('Application Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
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
      updatedAt: '2023-01-01T00:00:00Z'
    },
    createdAt: DateTime.fromISO('2023-01-01T00:00:00Z'),
    updatedAt: DateTime.fromISO('2023-01-01T00:00:00Z')
  }

  const mockApplicationDetail: ApplicationDetail = {
    ...mockApplication,
    files: [],
    comments: [],
    statuses: []
  }

  const mockSeed: ApplicationSeed = {
    createdBy: 'user-1',
    title: 'New App',
    content: 'New Content',
    tags: [],
    partition: 'part-1',
    targets: []
  }

  describe('actions', () => {
    it('fetchApplications fetches applications and updates state', async () => {
      const mockFetchApplications = vi.fn().mockResolvedValue([mockApplication])
      vi.mocked(useApplicationRepository).mockReturnValue({
        fetchApplications: mockFetchApplications,
        fetchApplication: vi.fn(),
        createApplication: vi.fn(),
        editApplication: vi.fn(),
        createComment: vi.fn(),
        editStatus: vi.fn()
      })

      const store = useApplicationStore()
      await store.fetchApplications()

      expect(mockFetchApplications).toHaveBeenCalled()
      expect(store.applications.value).toEqual([mockApplication])
      expect(store.isApplicationFetched.value).toBe(true)
    })

    it('fetchApplications handles error', async () => {
      const mockFetchApplications = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      vi.mocked(useApplicationRepository).mockReturnValue({
        fetchApplications: mockFetchApplications,
        fetchApplication: vi.fn(),
        createApplication: vi.fn(),
        editApplication: vi.fn(),
        createComment: vi.fn(),
        editStatus: vi.fn()
      })

      const store = useApplicationStore()
      await expect(store.fetchApplications()).rejects.toThrow(
        '申請一覧の取得に失敗しました'
      )
    })

    it('fetchApplication fetches application detail and updates state', async () => {
      const mockFetchApplication = vi
        .fn()
        .mockResolvedValue(mockApplicationDetail)
      vi.mocked(useApplicationRepository).mockReturnValue({
        fetchApplications: vi.fn(),
        fetchApplication: mockFetchApplication,
        createApplication: vi.fn(),
        editApplication: vi.fn(),
        createComment: vi.fn(),
        editStatus: vi.fn()
      })

      const store = useApplicationStore()
      await store.fetchApplication('app-1')

      expect(mockFetchApplication).toHaveBeenCalledWith('app-1')
      expect(store.currentApplication.value).toEqual(mockApplicationDetail)
    })

    it('createApplication creates application and adds to list', async () => {
      const mockCreateApplication = vi
        .fn()
        .mockResolvedValue(mockApplicationDetail)
      vi.mocked(useApplicationRepository).mockReturnValue({
        fetchApplications: vi.fn(),
        fetchApplication: vi.fn(),
        createApplication: mockCreateApplication,
        editApplication: vi.fn(),
        createComment: vi.fn(),
        editStatus: vi.fn()
      })

      const store = useApplicationStore()
      await store.createApplication(mockSeed)

      expect(mockCreateApplication).toHaveBeenCalledWith(mockSeed)
      expect(store.applications.value[0]).toEqual(mockApplicationDetail)
    })

    it('editApplication updates application and list', async () => {
      const mockUpdatedApp: ApplicationDetail = {
        ...mockApplicationDetail,
        title: 'Updated Title'
      }
      const mockEditApplication = vi.fn().mockResolvedValue(mockUpdatedApp)
      vi.mocked(useApplicationRepository).mockReturnValue({
        fetchApplications: vi.fn(),
        fetchApplication: vi.fn(),
        createApplication: vi.fn(),
        editApplication: mockEditApplication,
        createComment: vi.fn(),
        editStatus: vi.fn()
      })

      vi.mocked(useTagStore).mockReturnValue({
        ensureTags: vi.fn().mockResolvedValue([])
      } as any) // eslint-disable-line @typescript-eslint/no-explicit-any

      const store = useApplicationStore()
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
        updatedAt: DateTime.fromISO('2023-01-01T00:00:00Z')
      }
      const mockCreateComment = vi.fn().mockResolvedValue(mockComment)
      vi.mocked(useApplicationRepository).mockReturnValue({
        fetchApplications: vi.fn(),
        fetchApplication: vi.fn(),
        createApplication: vi.fn(),
        editApplication: vi.fn(),
        createComment: mockCreateComment,
        editStatus: vi.fn()
      })

      const store = useApplicationStore()
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
        createdAt: DateTime.fromISO('2023-01-01T00:00:00Z')
      }
      const mockEditStatus = vi.fn().mockResolvedValue(mockStatusDetail)
      vi.mocked(useApplicationRepository).mockReturnValue({
        fetchApplications: vi.fn(),
        fetchApplication: vi.fn(),
        createApplication: vi.fn(),
        editApplication: vi.fn(),
        createComment: vi.fn(),
        editStatus: mockEditStatus
      })

      const store = useApplicationStore()
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
      expect(store.applications.value[0].status).toBe('approved')
    })
  })

  describe('getters', () => {
    it('hasApplicationDetail returns correct value', () => {
      const store = useApplicationStore()

      store.currentApplication.value = null
      expect(store.hasApplicationDetail.value).toBe(false)

      store.currentApplication.value = mockApplicationDetail
      expect(store.hasApplicationDetail.value).toBe(true)
    })
  })
})
