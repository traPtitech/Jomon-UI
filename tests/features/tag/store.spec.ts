import { createApp } from 'vue'

import { createPinia, setActivePinia } from 'pinia'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { TagRepositoryKey } from '@/di'
import type { Tag } from '@/features/tag/entities'
import { useTagStore } from '@/features/tag/store'

describe('Tag Store', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    const pinia = createPinia()
    app = createApp({})
    app.use(pinia)
    setActivePinia(pinia)
    vi.clearAllMocks()
  })

  const mockTag: Tag = {
    id: 'tag-1',
    name: 'Tag 1',
  }

  const createMockRepository = () => ({
    fetchTags: vi.fn(),
    createTag: vi.fn(),
    deleteTag: vi.fn(),
  })

  describe('actions', () => {
    it('fetchTags fetches tags and updates state', async () => {
      const mockFetchTags = vi.fn().mockResolvedValue([mockTag])
      const mockRepo = {
        ...createMockRepository(),
        fetchTags: mockFetchTags,
      }
      app.provide(TagRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useTagStore())
      await store.fetchTags()

      expect(mockFetchTags).toHaveBeenCalled()
      expect(store.tags.value).toEqual([mockTag])
      expect(store.status.value).toBe('success')
      expect(store.isTagFetched.value).toBe(true)
    })

    it('fetchTags handles error', async () => {
      const mockFetchTags = vi
        .fn()
        .mockRejectedValue(new Error('Network error'))
      const mockRepo = {
        ...createMockRepository(),
        fetchTags: mockFetchTags,
      }
      app.provide(TagRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useTagStore())
      await expect(store.fetchTags()).rejects.toThrow(
        'タグの取得に失敗しました'
      )
      expect(store.status.value).toBe('error')
      expect(store.error.value).toContain('タグの取得に失敗しました')
    })

    it('createTag creates a new tag and adds it to the list', async () => {
      const newTag: Tag = { id: 'tag-2', name: 'New' }

      const mockCreateTag = vi.fn().mockResolvedValue(newTag)
      const mockRepo = {
        ...createMockRepository(),
        createTag: mockCreateTag,
      }
      app.provide(TagRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useTagStore())

      const result = await store.createTag('New')

      expect(mockCreateTag).toHaveBeenCalledWith('New')
      expect(result).toEqual(newTag)
      expect(store.tags.value).toContainEqual(newTag)
    })

    it('deleteTags deletes tags and removes from list', async () => {
      const mockDeleteTag = vi.fn().mockResolvedValue(undefined)
      const mockRepo = {
        ...createMockRepository(),
        deleteTag: mockDeleteTag,
      }
      app.provide(TagRepositoryKey, mockRepo)

      const store = app.runWithContext(() => useTagStore())
      store.tags.value = [mockTag]

      await store.deleteTags(['tag-1'])

      expect(mockDeleteTag).toHaveBeenCalledWith('tag-1', 0, ['tag-1'])
      expect(store.tags.value).toEqual([])
    })
  })

  describe('getters', () => {
    it('tagOptions returns formatted options', () => {
      app.provide(TagRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => useTagStore())
      store.tags.value = [mockTag]

      expect(store.tagOptions.value).toEqual([
        { key: mockTag.name, value: mockTag },
      ])
    })

    it('tagIdOptions returns formatted options with id', () => {
      app.provide(TagRepositoryKey, createMockRepository())
      const store = app.runWithContext(() => useTagStore())
      store.tags.value = [mockTag]

      expect(store.tagIdOptions.value).toEqual([
        { key: mockTag.name, value: mockTag.id },
      ])
    })
  })
})
