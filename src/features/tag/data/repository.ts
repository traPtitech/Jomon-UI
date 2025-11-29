import apis, { type TagInput } from '@/lib/apis'

import type { Tag } from '../entities'

export const useTagRepository = () => {
  return createTagRepository()
}

const toTagInput = (name: string): TagInput => ({
  name,
})

const createTagRepository = () => ({
  fetchTags: async (): Promise<Tag[]> => {
    const { data } = await apis.getTags()
    return data.map(tag => ({
      id: tag.id,
      name: tag.name,
    }))
  },
  createTag: async (name: string): Promise<Tag> => {
    const { data } = await apis.postTag(toTagInput(name))
    return {
      id: data.id,
      name: data.name,
    }
  },
  deleteTag: async (id: string) => {
    await apis.deleteTag(id)
  },
})
