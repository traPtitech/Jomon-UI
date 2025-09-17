import { useTagRepository } from './data/repository'
import type { Tag } from './entities'
import { defineStore, storeToRefs } from 'pinia'

const createTagStore = defineStore('tag', {
  state: () => ({
    tags: [] as Tag[],
    isTagFetched: false
  }),
  getters: {
    tagOptions: state =>
      state.tags.map(tag => ({
        key: tag.name,
        value: tag
      })),
    tagIdOptions: state =>
      state.tags.map(tag => ({
        key: tag.name,
        value: tag.id
      }))
  },
  actions: {
    async fetchTags() {
      const repository = useTagRepository()
      try {
        this.tags = await repository.fetchTags()
        this.isTagFetched = true
      } catch (e) {
        throw new Error('タグの取得に失敗しました: ' + e)
      }
    },
    async ensureTags(containNewTags: Tag[]): Promise<Tag[]> {
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
        this.tags.push(...created)
        return [...alreadyExists, ...created]
      } catch {
        throw new Error('新規タグの作成に失敗しました')
      }
    },
    async deleteTags(ids: string[]) {
      const repository = useTagRepository()
      try {
        await Promise.all(ids.map(repository.deleteTag))
        this.tags = this.tags.filter(tag => !ids.includes(tag.id))
      } catch {
        throw new Error('タグの削除に失敗しました')
      }
    },
    reset() {
      this.tags = []
      this.isTagFetched = false
    }
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
