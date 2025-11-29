import { useTagRepository } from './data/repository'
import type { Tag } from './entities'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])
  const isTagFetched = ref(false)

  const tagOptions = computed(() =>
    tags.value.map(tag => ({
      key: tag.name,
      value: tag
    }))
  )

  const tagIdOptions = computed(() =>
    tags.value.map(tag => ({
      key: tag.name,
      value: tag.id
    }))
  )

  const fetchTags = async () => {
    const repository = useTagRepository()
    try {
      tags.value = await repository.fetchTags()
      isTagFetched.value = true
    } catch (e) {
      throw new Error(
        'タグの取得に失敗しました: ' +
          (e instanceof Error ? e.message : String(e))
      )
    }
  }

  const ensureTags = async (containNewTags: Tag[]): Promise<Tag[]> => {
    const repository = useTagRepository()
    const alreadyExists: Tag[] = []
    const promises: Promise<Tag>[] = []

    for (const tag of containNewTags) {
      if (tag.id === '') {
        promises.push(repository.createTag(tag.name))
      } else {
        alreadyExists.push(tag)
      }
    }

    try {
      const created = await Promise.all(promises)
      tags.value.push(...created)
      return [...alreadyExists, ...created]
    } catch {
      throw new Error('新規タグの作成に失敗しました')
    }
  }

  const deleteTags = async (ids: string[]) => {
    const repository = useTagRepository()
    try {
      await Promise.all(ids.map(repository.deleteTag))
      tags.value = tags.value.filter(tag => !ids.includes(tag.id))
    } catch {
      throw new Error('タグの削除に失敗しました')
    }
  }

  const reset = () => {
    tags.value = []
    isTagFetched.value = false
  }

  return {
    tags,
    isTagFetched,
    tagOptions,
    tagIdOptions,
    fetchTags,
    ensureTags,
    deleteTags,
    reset
  }
})

export const useTagStore = () => {
  const store = createTagStore()
  const refs = storeToRefs(store)

  return {
    ...refs,
    fetchTags: store.fetchTags,
    ensureTags: store.ensureTags,
    deleteTags: store.deleteTags,
    reset: store.reset
  }
}

export type TagStore = ReturnType<typeof useTagStore>
