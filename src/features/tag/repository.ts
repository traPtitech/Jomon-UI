import apis from '/@/lib/apis'

export const useTagRepository = () => {
  return createTagRepository()
}

const createTagRepository = () => ({
  fetchTags: async () => {
    const { data } = await apis.getTags()
    return data.map(tag => ({
      id: tag.id,
      name: tag.name
    }))
  },
  createTag: async (name: string) => {
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
