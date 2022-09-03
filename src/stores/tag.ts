import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Tag } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useTagStore = defineStore('tag', () => {
  const tags = ref<Tag[]>()
  const isTagFetched = ref(false)

  const fetchTags = async () => {
    try {
      tags.value = (await apis.getTags()).data
      isTagFetched.value = true
    } catch (err) {
      alert(err)
    }
  }
  const postTag = async (tag: Tag) => {
    try {
      await apis.postTag(tag)
    } catch (err) {
      alert(err)
    }
  }
  const deleteTag = async (id: string) => {
    try {
      await apis.tagsTagIDDelete(id)
    } catch (err) {
      alert(err)
    }
  }
  return { tags, isTagFetched, fetchTags, postTag, deleteTag }
})
