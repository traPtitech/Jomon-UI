import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>([])

  const fetchTags = async () => {
    tags.value = (await apis.getTags()).data
  }
  const postTag = async (tag: Tag) => {
    await apis.postTag(tag)
  }
  const deleteTag = async (id: string) => {
    await apis.tagsTagIDDelete(id)
  }
  return { tags, fetchTags, postTag, deleteTag }
})
