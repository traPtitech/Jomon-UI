import apis from '/@/lib/apis'

import type { Tag } from './model'

export const useTagRepository = () => {
  return createTagRepository()
}

const createTagRepository = () => ({
  fetchTags: async (): Promise<Tag[]> => {
    const { data } = await apis.getTags()
    return data.map(tag => ({
      id: tag.id,
      name: tag.name
    }))
  },
  createTag: async (name: string): Promise<Tag> => {
    const { data } = await apis.postTag({ name })
    return {
      id: data.id,
      name: data.name
    }
  },
  deleteTag: async (id: string) => {
    await apis.tagsTagIDDelete(id)
  }
})
