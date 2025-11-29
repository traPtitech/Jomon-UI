import { useTagRepository } from '@/features/tag/data/repository'
import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock repository
vi.mock('@/features/tag/data/repository', () => ({
  useTagRepository: vi.fn()
}))

describe('Tag Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockTag: Tag = {
    id: 'tag-1',
    name: 'Tag 1'
  }

  describe('actions', () => {
    it('fetchTags fetches tags and updates state', async () => {
      const mockFetchTags = vi.fn().mockResolvedValue([mockTag])
      vi.mocked(useTagRepository).mockReturnValue({
        fetchTags: mockFetchTags,
        createTag: vi.fn(),
        deleteTag: vi.fn()
      })

      const store = useTagStore()
      await store.fetchTags()

      expect(mockFetchTags).toHaveBeenCalled()
      expect(store.tags.value).toEqual([mockTag])
      expect(store.isTagFetched.value).toBe(true)
    })

    it('fetchTags handles error', async () => {
      const mockFetchTags = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      vi.mocked(useTagRepository).mockReturnValue({
        fetchTags: mockFetchTags,
        createTag: vi.fn(),
        deleteTag: vi.fn()
      })

      const store = useTagStore()
      await expect(store.fetchTags()).rejects.toThrow(
        'タグの取得に失敗しました'
      )
    })

    it('ensureTags creates missing tags and returns all tags', async () => {
      const existingTag: Tag = { id: 'tag-1', name: 'Existing' }
      const newTag: Tag = { id: 'tag-2', name: 'New' }

      const mockCreateTag = vi.fn().mockResolvedValue(newTag)
      vi.mocked(useTagRepository).mockReturnValue({
        fetchTags: vi.fn(),
        createTag: mockCreateTag,
        deleteTag: vi.fn()
      })

      const store = useTagStore()
      store.tags.value = [existingTag]

      const result = await store.ensureTags([
        existingTag,
        { id: '', name: 'New' } as Tag
      ])

      expect(mockCreateTag).toHaveBeenCalledWith('New')
      expect(result).toEqual([existingTag, newTag])
      expect(store.tags.value).toContainEqual(newTag)
    })

    it('deleteTags deletes tags and removes from list', async () => {
      const mockDeleteTag = vi.fn().mockResolvedValue(undefined)
      vi.mocked(useTagRepository).mockReturnValue({
        fetchTags: vi.fn(),
        createTag: vi.fn(),
        deleteTag: mockDeleteTag
      })

      const store = useTagStore()
      store.tags.value = [mockTag]

      await store.deleteTags(['tag-1'])

      expect(mockDeleteTag).toHaveBeenCalledWith('tag-1', 0, ['tag-1'])
      expect(store.tags.value).toEqual([])
    })
  })

  describe('getters', () => {
    it('tagOptions returns formatted options', () => {
      const store = useTagStore()
      store.tags.value = [mockTag]

      expect(store.tagOptions.value).toEqual([
        { key: mockTag.name, value: mockTag }
      ])
    })

    it('tagIdOptions returns formatted options with id', () => {
      const store = useTagStore()
      store.tags.value = [mockTag]

      expect(store.tagIdOptions.value).toEqual([
        { key: mockTag.name, value: mockTag.id }
      ])
    })
  })
})
