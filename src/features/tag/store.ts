import { computed, inject, ref } from 'vue'

import { defineStoreComposable } from '@/lib/store'

import { TagRepositoryKey } from '@/di'
import type { AsyncStatus } from '@/types'

import type { Tag } from './entities'

export const useTagStore = defineStoreComposable('tag', () => {
  const repository = inject(TagRepositoryKey)
  if (!repository) throw new Error('TagRepository is not provided')

  const tags = ref<Tag[]>([])
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)

  const tagOptions = computed(() =>
    tags.value.map(tag => ({
      key: tag.name,
      value: tag,
    }))
  )

  const tagIdOptions = computed(() =>
    tags.value.map(tag => ({
      key: tag.name,
      value: tag.id,
    }))
  )

  const isTagFetched = computed(() => status.value === 'success')

  const fetchTags = async () => {
    status.value = 'loading'
    error.value = null

    try {
      tags.value = await repository.fetchTags()
      status.value = 'success'
    } catch (e) {
      status.value = 'error'
      error.value =
        'タグの取得に失敗しました: ' +
        (e instanceof Error ? e.message : String(e))
      throw new Error(error.value)
    }
  }

  const createTag = async (name: string): Promise<Tag> => {
    try {
      const newTag = await repository.createTag(name)
      tags.value.push(newTag)
      return newTag
    } catch {
      throw new Error('タグの作成に失敗しました')
    }
  }

  const deleteTags = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(repository.deleteTag))
      tags.value = tags.value.filter(tag => !ids.includes(tag.id))
    } catch {
      throw new Error('タグの削除に失敗しました')
    }
  }

  const reset = () => {
    tags.value = []
    status.value = 'idle'
    error.value = null
  }

  return {
    tags,
    status,
    error,
    isTagFetched,
    tagOptions,
    tagIdOptions,
    fetchTags,
    createTag,
    deleteTags,
    reset,
  }
})

export type TagStore = ReturnType<typeof useTagStore>
